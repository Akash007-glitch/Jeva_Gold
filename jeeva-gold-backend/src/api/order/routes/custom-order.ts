/**
 * custom-order.ts — Custom Razorpay routes
 *
 * Accessible at:
 *   POST /api/orders/create-razorpay-order
 *   POST /api/orders/verify-payment
 *   POST /api/orders/razorpay-webhook
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/create-razorpay-order',
      handler: 'api::order.order.createRazorpayOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/verify-payment',
      handler: 'api::order.order.verifyPayment',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/razorpay-webhook',
      handler: 'api::order.order.razorpayWebhook',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
