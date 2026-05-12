const assert = require('node:assert/strict');
const test = require('node:test');

const payment = require('../dist/src/api/order/services/payment.js');

test('normalizes create-order input and calculates trusted totals', () => {
  const order = payment.normalizeCreateOrderPayload({
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '9876543210',
    shipping_address: '123 Test Street, Guwahati, Assam, 781001',
    items: [{ product_id: 2, quantity: 2 }],
  });

  assert.deepEqual(order.items, [
    {
      product_id: '2',
      name: 'Jeeva Gold Premium Tea',
      size: '250g x 2 Pack',
      price: 210,
      quantity: 2,
    },
  ]);
  assert.equal(order.subtotal_amount, 420);
  assert.equal(order.tax_amount, 76);
  assert.equal(order.shipping_amount, 0);
  assert.equal(order.total_amount, 496);
});

test('rejects tampered create-order totals', () => {
  assert.throws(
    () =>
      payment.normalizeCreateOrderPayload({
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '9876543210',
        shipping_address: '123 Test Street, Guwahati, Assam, 781001',
        items: [{ product_id: 2, quantity: 1 }],
        total_amount: 1,
      }),
    /Order total mismatch/
  );
});

test('rejects unknown product ids', () => {
  assert.throws(
    () =>
      payment.normalizeCreateOrderPayload({
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '9876543210',
        shipping_address: '123 Test Street, Guwahati, Assam, 781001',
        items: [{ product_id: 999, quantity: 1 }],
      }),
    /Unknown product_id/
  );
});

test('validates Razorpay payment signatures', () => {
  const body = 'order_123|pay_123';
  const secret = 'test_secret';
  const signature = payment.createHmacSignature(body, secret);

  assert.equal(payment.isValidSignature(body, signature, secret), true);
  assert.equal(payment.isValidSignature(body, 'bad_signature', secret), false);
});

test('extracts paid updates from Razorpay webhook payloads', () => {
  const update = payment.getWebhookOrderUpdate({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_123',
          order_id: 'order_123',
          status: 'captured',
        },
      },
    },
  });

  assert.deepEqual(update, {
    razorpay_order_id: 'order_123',
    razorpay_payment_id: 'pay_123',
    payment_status: 'paid',
  });
});
