import { factories } from '@strapi/strapi';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../../../lib/models/Order';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured in environment variables');
  }

  return new Razorpay({ key_id, key_secret });
};

// ─── Controller ───────────────────────────────────────────────────────────────

export default factories.createCoreController('api::order.order', () => ({
  /**
   * POST /api/orders/create-razorpay-order
   * Creates a Razorpay order and saves a pending order to MongoDB.
   */
  async createRazorpayOrder(ctx: any) {
    try {
      const {
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        items,
        total_amount,
      } = ctx.request.body;

      // ── Validation ──────────────────────────────────────────────────────────
      if (
        !customer_name ||
        !customer_email ||
        !customer_phone ||
        !shipping_address ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !total_amount
      ) {
        return ctx.badRequest(
          'Missing required fields: customer_name, customer_email, customer_phone, shipping_address, items, total_amount'
        );
      }

      // ── Create Razorpay order ────────────────────────────────────────────────
      const razorpay = getRazorpay();
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total_amount * 100), // convert ₹ to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      // ── Save pending order to MongoDB ────────────────────────────────────────
      const order = new Order({
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        items,
        total_amount,
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending',
      });
      await order.save();

      // ── Respond ──────────────────────────────────────────────────────────────
      return ctx.send({
        success: true,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order._id,
      });
    } catch (error: any) {
      console.error('createRazorpayOrder error:', error);
      return ctx.internalServerError(error?.message || 'Failed to create order');
    }
  },

  /**
   * POST /api/orders/verify-payment
   * Verifies Razorpay signature and updates order status in MongoDB.
   */
  async verifyPayment(ctx: any) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        ctx.request.body;

      // ── Validation ──────────────────────────────────────────────────────────
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return ctx.badRequest(
          'Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature'
        );
      }

      // ── Verify HMAC signature ────────────────────────────────────────────────
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      if (!key_secret) {
        return ctx.internalServerError('Razorpay secret not configured');
      }

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === razorpay_signature;

      // ── Update order in MongoDB ──────────────────────────────────────────────
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpay_order_id },
        {
          payment_status: isValid ? 'paid' : 'failed',
          razorpay_payment_id,
        },
        { new: true }
      );

      if (!updatedOrder) {
        return ctx.notFound('Order not found for the given razorpay_order_id');
      }

      if (isValid) {
        return ctx.send({
          success: true,
          message: 'Payment verified successfully',
          order_id: updatedOrder._id,
          payment_status: 'paid',
        });
      } else {
        return ctx.badRequest('Payment signature verification failed');
      }
    } catch (error: any) {
      console.error('verifyPayment error:', error);
      return ctx.internalServerError(error?.message || 'Payment verification failed');
    }
  },
}));