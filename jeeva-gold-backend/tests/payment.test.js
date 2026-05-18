const assert = require('node:assert/strict');
const test = require('node:test');

const payment = require('../dist/src/api/order/services/payment.js');
const ownerNotification = require('../dist/src/api/order/services/owner-notification.js');

test('normalizes frontend catalog input and calculates trusted totals', () => {
  const order = payment.normalizeCreateOrderPayload({
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '9876543210',
    shipping_address: '123 Test Street, Guwahati, Assam, 781001',
    items: [{ product_id: 'starter-2', quantity: 2 }],
  });

  assert.deepEqual(order.items, [
    {
      product_id: 'starter-2',
      variant_id: undefined,
      name: 'Jeeva Gold Premium Tea',
      size: '250g x 2 Pack',
      price: 210,
      quantity: 2,
    },
  ]);
  assert.equal(order.subtotal_amount, 420);
  assert.equal(order.tax_amount, 0);
  assert.equal(order.shipping_amount, 0);
  assert.equal(order.total_amount, 420);
});

test('maps legacy numeric starter product ids to the frontend catalog', () => {
  const order = payment.normalizeCreateOrderPayload({
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '9876543210',
    shipping_address: '123 Test Street, Guwahati, Assam, 781001',
    items: [{ product_id: 3, quantity: 1 }],
  });

  assert.equal(order.items[0].product_id, 'starter-3');
  assert.equal(order.items[0].price, 290);
  assert.equal(order.total_amount, 290);
});

test('ignores stale variant ids for frontend catalog products', () => {
  const order = payment.normalizeCreateOrderPayload({
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '9876543210',
    shipping_address: '123 Test Street, Guwahati, Assam, 781001',
    items: [{ product_id: 2, variant_id: 7, quantity: 1 }],
  });

  assert.equal(order.items[0].product_id, 'starter-2');
  assert.equal(order.items[0].variant_id, undefined);
  assert.equal(order.total_amount, 210);
});

test('rejects tampered create-order totals', () => {
  assert.throws(
    () =>
      payment.normalizeCreateOrderPayload({
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '9876543210',
        shipping_address: '123 Test Street, Guwahati, Assam, 781001',
        items: [{ product_id: 'starter-2', quantity: 1 }],
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

test('builds a dispatch-ready owner order summary', () => {
  const summary = ownerNotification.buildOwnerOrderSummary({
    id: 42,
    payment_status: 'paid',
    dispatch_status: 'ready_to_dispatch',
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '9876543210',
    shipping_address: '123 Test Street, Guwahati, Assam, 781001',
    items: [
      {
        name: 'Jeeva Gold Premium Tea',
        size: '250g x 2 Pack',
        price: 210,
        quantity: 2,
      },
    ],
    subtotal_amount: 420,
    tax_amount: 0,
    shipping_amount: 0,
    total_amount: 420,
    razorpay_order_id: 'order_123',
    razorpay_payment_id: 'pay_123',
  });

  assert.match(summary, /Order #42/);
  assert.match(summary, /ready_to_dispatch/);
  assert.match(summary, /Test User/);
  assert.match(summary, /Jeeva Gold Premium Tea/);
  assert.match(summary, /Total: Rs 420/);
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
