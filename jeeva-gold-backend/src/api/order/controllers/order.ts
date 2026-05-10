import { factories } from '@strapi/strapi';
import Razorpay from 'razorpay';
import {
  PaymentValidationError,
  getWebhookOrderUpdate,
  getWebhookRawBody,
  isValidSignature,
  normalizeCreateOrderPayload,
  validateVerifyPaymentPayload,
} from '../services/payment';

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

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async createRazorpayOrder(ctx: any) {
    try {
      const orderInput = normalizeCreateOrderPayload(ctx.request.body);

      const razorpay = getRazorpay();
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(orderInput.total_amount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      const order = await strapi.db.query('api::order.order').create({
        data: {
          customer_name: orderInput.customer_name,
          customer_email: orderInput.customer_email,
          customer_phone: orderInput.customer_phone,
          shipping_address: orderInput.shipping_address,
          items: orderInput.items,
          subtotal_amount: orderInput.subtotal_amount,
          tax_amount: orderInput.tax_amount,
          shipping_amount: orderInput.shipping_amount,
          total_amount: orderInput.total_amount,
          razorpay_order_id: razorpayOrder.id,
          payment_status: 'pending',
        },
      });

      return ctx.send({
        success: true,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order.id,
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

      const updatedOrder = await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data: {
          payment_status: isValid ? 'paid' : 'failed',
          razorpay_payment_id: payment.razorpay_payment_id,
        },
      });

      if (!isValid) {
        return ctx.badRequest('Payment signature verification failed');
      }

      return ctx.send({
        success: true,
        message: 'Payment verified successfully',
        order_id: updatedOrder.id,
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

      const data: Record<string, string> = {
        payment_status: update.payment_status,
      };

      if (update.razorpay_payment_id) {
        data.razorpay_payment_id = update.razorpay_payment_id;
      }

      const updatedOrder = await strapi.db.query('api::order.order').update({
        where: { id: order.id },
        data,
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
}));
