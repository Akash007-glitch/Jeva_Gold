'use strict';

const Razorpay = require('razorpay');
const nodeCrypto = require('crypto');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async createOrder(ctx) {
        try {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const { items, customer } = ctx.request.body;

            if (!items || !customer) {
                return ctx.badRequest('Missing data');
            }

            let total = 0;
            for (const item of items) {
                const product = await strapi.entityService.findOne(
                    'api::product.product', item.productId, { populate: ['variants'] }
                );
                
                if (!product) {
                    return ctx.badRequest(`Product with ID ${item.productId} not found`);
                }

                const variant = product.variants?.find(v => v.size === item.size);
                
                if (!variant) {
                    return ctx.badRequest(`Variant with size '${item.size}' not found for product ID ${item.productId}. Valid sizes are typically '100g', '250g', or '500g'.`);
                }

                total += variant.price * item.quantity;
            }

            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(total * 100),
                currency: 'INR',
                receipt: `rcpt_${Date.now()}`,
            });

            const order = await strapi.entityService.create('api::order.order', {
                data: {
                    customer_name: customer.name,
                    customer_email: customer.email,
                    customer_phone: customer.phone,
                    shipping_address: customer.address,
                    items,
                    total_amount: total,
                    razorpay_order_id: razorpayOrder.id,
                    payment_status: 'pending',
                },
            });

            ctx.body = {
                razorpay_order_id: razorpayOrder.id,
                key_id: process.env.RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                orderId: order.id,
            };
        } catch (err) {
            strapi.log.error(err);
            ctx.internalServerError(err.message);
        }
    },

    async verifyPayment(ctx) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = ctx.request.body;

            const expected = nodeCrypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(razorpay_order_id + '|' + razorpay_payment_id)
                .digest('hex');

            if (expected !== razorpay_signature) {
                return ctx.unauthorized('Invalid signature');
            }

            await strapi.entityService.update('api::order.order', orderId, {
                data: { payment_status: 'paid' },
            });

            ctx.body = { success: true };
        } catch (err) {
            ctx.internalServerError(err.message);
        }
    },
}));