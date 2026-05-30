import { factories } from '@strapi/strapi';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import {
  PaymentValidationError,
  getWebhookOrderUpdate,
  getWebhookRawBody,
  isValidSignature,
  normalizeCreateOrderPayload,
  validateVerifyPaymentPayload,
} from '../services/payment';
import {
  buildOwnerOrderSummary,
  notifyOwnerForPaidOrder,
} from '../services/owner-notification';
import { sendCustomerNotification } from '../../../services/notifications';

const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured in environment variables');
  }

  return new Razorpay({ key_id, key_secret });
};

const handleControllerError = (ctx: any, error: any, fallbackMessage: string) => {
  if (error instanceof PaymentValidationError) {
    return ctx.badRequest(error.message);
  }

  console.error(fallbackMessage, error);
  return ctx.internalServerError(error?.message || fallbackMessage);
};

const maskPhone = (phone?: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 4) return '****';
  return `******${cleaned.slice(-4)}`;
};

const maskEmail = (email?: string) => {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length < 2) return '***';
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

const maskAddress = (address?: string) => {
  if (!address) return '';
  const parts = address.split(',').map((p) => p.trim());
  if (parts.length <= 2) {
    return '******';
  }
  const maskedParts = parts.map((part, index) => {
    if (index < parts.length - 3) {
      return '******';
    }
    return part;
  });
  return maskedParts.join(', ');
};

const markOrderPaidAndNotifyOwner = async (strapi: any, order: any, razorpay_payment_id?: string) => {
  if (order.payment_status === 'paid' && order.owner_order_summary) {
    return order;
  }

  const paidOrderData: Record<string, any> = {
    payment_status: 'paid',
    dispatch_status: 'confirmed',
    paid_at: new Date(),
  };

  if (razorpay_payment_id) {
    paidOrderData.razorpay_payment_id = razorpay_payment_id;
  }

  let paidOrder = await strapi.db.query('api::order.order').update({
    where: { id: order.id },
    data: paidOrderData,
  });

  // Call customer notification service with order details
  await sendCustomerNotification(paidOrder, 'placed');

  const summary = buildOwnerOrderSummary(paidOrder);
  const notification = await notifyOwnerForPaidOrder(strapi, {
    ...paidOrder,
    owner_order_summary: summary,
  });

  paidOrder = await strapi.db.query('api::order.order').update({
    where: { id: paidOrder.id },
    data: {
      owner_order_summary: summary,
      owner_notification_sent_at: notification.sent ? new Date() : null,
      owner_notification_error: notification.error,
    },
  });

  return paidOrder;
};

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async createRazorpayOrder(ctx: any) {
    try {
      console.log('[DEBUG] createRazorpayOrder - process.env.RAZORPAY_KEY_ID =', process.env.RAZORPAY_KEY_ID);
      const orderInput = normalizeCreateOrderPayload(ctx.request.body);

      const razorpay = getRazorpay();
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(orderInput.total_amount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      const tracking_token = crypto.randomBytes(24).toString('hex');

      let order = await strapi.db.query('api::order.order').create({
        data: {
          customer_name: orderInput.customer_name,
          customer_email: orderInput.customer_email || '',
          customer_phone: orderInput.customer_phone,
          shipping_address: orderInput.shipping_address,
          items: orderInput.items,
          subtotal_amount: orderInput.subtotal_amount,
          tax_amount: orderInput.tax_amount,
          shipping_amount: orderInput.shipping_amount,
          total_amount: orderInput.total_amount,
          razorpay_order_id: razorpayOrder.id,
          payment_status: 'pending',
          dispatch_status: 'pending_payment',
          tracking_token,
        },
      });

      const order_number = `ORD${10000 + order.id}`;
      order = await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data: { order_number },
      });

      const owner_order_summary = buildOwnerOrderSummary(order);
      await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data: {
          owner_order_summary,
        },
      });

      return ctx.send({
        success: true,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        order_number: order.order_number,
        tracking_token: order.tracking_token,
        totals: {
          subtotal_amount: orderInput.subtotal_amount,
          tax_amount: orderInput.tax_amount,
          shipping_amount: orderInput.shipping_amount,
          total_amount: orderInput.total_amount,
        },
      });
    } catch (error: any) {
      return handleControllerError(ctx, error, 'Failed to create order');
    }
  },

  async verifyPayment(ctx: any) {
    try {
      const payment = validateVerifyPaymentPayload(ctx.request.body);
      const key_secret = process.env.RAZORPAY_KEY_SECRET;

      if (!key_secret) {
        return ctx.internalServerError('Razorpay secret not configured');
      }

      const order = await strapi.db.query('api::order.order').findOne({
        where: { razorpay_order_id: payment.razorpay_order_id },
      });

      if (!order) {
        return ctx.notFound('Order not found for the given razorpay_order_id');
      }

      const signatureBody = `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`;
      const isValid = isValidSignature(signatureBody, payment.razorpay_signature, key_secret);

      if (!isValid) {
        await strapi.db.query('api::order.order').update({
          where: { id: order.id },
          data: {
            payment_status: 'failed',
            razorpay_payment_id: payment.razorpay_payment_id,
            dispatch_status: 'cancelled',
          },
        });

        return ctx.badRequest('Payment signature verification failed');
      }

      const updatedOrder = await markOrderPaidAndNotifyOwner(
        strapi,
        order,
        payment.razorpay_payment_id
      );

      return ctx.send({
        success: true,
        message: 'Payment verified successfully',
        order_id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        tracking_token: updatedOrder.tracking_token,
        payment_status: 'paid',
      });
    } catch (error: any) {
      return handleControllerError(ctx, error, 'Payment verification failed');
    }
  },

  async razorpayWebhook(ctx: any) {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const webhookSignature = ctx.get('x-razorpay-signature');

      if (!webhookSecret) {
        return ctx.internalServerError('Razorpay webhook secret not configured');
      }

      if (!webhookSignature) {
        return ctx.badRequest('Missing Razorpay webhook signature');
      }

      const rawBody = getWebhookRawBody(ctx);
      if (!isValidSignature(rawBody, webhookSignature, webhookSecret)) {
        return ctx.badRequest('Invalid Razorpay webhook signature');
      }

      const update = getWebhookOrderUpdate(ctx.request.body);
      if (!update) {
        return ctx.send({ success: true, ignored: true });
      }

      const order = await strapi.db.query('api::order.order').findOne({
        where: { razorpay_order_id: update.razorpay_order_id },
      });

      if (!order) {
        ctx.status = 202;
        ctx.body = {
          success: true,
          accepted: true,
          message: 'Webhook accepted, but order was not found locally',
        };
        return;
      }

      if (order.payment_status === 'paid' && update.payment_status === 'failed') {
        return ctx.send({ success: true, ignored: true, payment_status: 'paid' });
      }

      const updatedOrder =
        update.payment_status === 'paid'
          ? await markOrderPaidAndNotifyOwner(strapi, order, update.razorpay_payment_id)
          : await strapi.db.query('api::order.order').update({
              where: { id: order.id },
              data: {
                payment_status: 'failed',
                razorpay_payment_id: update.razorpay_payment_id,
                dispatch_status: 'cancelled',
              },
            });

      return ctx.send({
        success: true,
        order_id: updatedOrder.id,
        payment_status: updatedOrder.payment_status,
      });
    } catch (error: any) {
      return handleControllerError(ctx, error, 'Razorpay webhook handling failed');
    }
  },

  async trackOrder(ctx: any) {
    try {
      const { number, order_number, id, token } = ctx.query;
      const lookupNumber = order_number || number || id;

      if (!lookupNumber || !token) {
        return ctx.badRequest('Missing order number or tracking token');
      }

      const order = await strapi.db.query('api::order.order').findOne({
        where: {
          order_number: String(lookupNumber).trim(),
          tracking_token: String(token).trim(),
        },
      });

      if (!order) {
        // Return 404 with exact custom message
        ctx.status = 404;
        return ctx.send({
          success: false,
          message: 'Invalid or expired tracking link',
        });
      }

      return ctx.send({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_email: maskEmail(order.customer_email),
          customer_phone: maskPhone(order.customer_phone),
          total_amount: order.total_amount,
          payment_status: order.payment_status,
          dispatch_status: order.dispatch_status,
          dispatch_notes: order.dispatch_notes,
          createdAt: order.createdAt,
          paid_at: order.paid_at,
          items: order.items,
          shipping_address: maskAddress(order.shipping_address),
          support_contact: {
            email: 'vinayakteamarketing@gmail.com',
            phone: '+91 84720 81093',
          },
        },
      });
    } catch (error: any) {
      return handleControllerError(ctx, error, 'Failed to track order');
    }
  },

  async regenerateToken(ctx: any) {
    try {
      const { id } = ctx.params;
      const { expire } = ctx.request.body || {};

      const order = await strapi.db.query('api::order.order').findOne({
        where: { id: Number(id) },
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      const newToken = expire ? '' : crypto.randomBytes(24).toString('hex');

      const updated = await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data: {
          tracking_token: newToken,
        },
      });

      return ctx.send({
        success: true,
        message: expire ? 'Tracking token expired' : 'Tracking token regenerated',
        tracking_token: updated.tracking_token,
      });
    } catch (error: any) {
      return handleControllerError(ctx, error, 'Failed to regenerate token');
    }
  },
}));
