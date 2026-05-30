const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
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
  assert.equal(order.items[0].price, 300);
  assert.equal(order.total_amount, 300);
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

test('syncToGoogleSheets formats payload and posts to webhook URL', async () => {
  const originalFetch = globalThis.fetch;
  let postedUrl = null;
  let postedOptions = null;

  globalThis.fetch = async (url, options) => {
    postedUrl = url;
    postedOptions = options;
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    };
  };

  process.env.GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/mock/exec';

  try {
    const result = await ownerNotification.syncToGoogleSheets({
      id: 42,
      order_number: 'ORD10042',
      createdAt: '2026-05-30T06:00:00.000Z',
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      customer_phone: '9876543210',
      shipping_address: '123 Test Street, Guwahati, Assam',
      items: [
        { name: 'Jeeva Gold Premium Tea', size: '250g x 2 Pack', quantity: 2 }
      ],
      subtotal_amount: 420,
      tax_amount: 0,
      shipping_amount: 0,
      total_amount: 420,
      payment_status: 'paid',
      razorpay_payment_id: 'pay_xyz123'
    });

    assert.equal(result.synced, true);
    assert.equal(postedUrl, 'https://script.google.com/macros/s/mock/exec');
    assert.equal(postedOptions.method, 'POST');
    assert.equal(postedOptions.redirect, 'follow');

    const parsedPayload = JSON.parse(postedOptions.body);
    assert.equal(parsedPayload.order_number, 'ORD10042');
    assert.equal(parsedPayload.customer_name, 'Test Customer');
    assert.equal(parsedPayload.items, 'Jeeva Gold Premium Tea (250g x 2 Pack) x 2');
    assert.equal(parsedPayload.total_amount, 420);
    assert.equal(parsedPayload.razorpay_payment_id, 'pay_xyz123');
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  }
});

test('syncToGoogleSheets returns synced false if webhook URL is not set', async () => {
  const result = await ownerNotification.syncToGoogleSheets({ id: 42 });
  assert.equal(result.synced, false);
  assert.match(result.reason, /not configured/);
});

test('notifyOwnerForPaidOrder syncs Google Sheets even when owner email is not configured', async () => {
  const originalFetch = globalThis.fetch;
  const originalWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const originalOwnerEmail = process.env.OWNER_ORDER_EMAIL;
  const originalCwd = process.cwd();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jeeva-gold-orders-'));
  let postedPayload = null;

  globalThis.fetch = async (_url, options) => {
    postedPayload = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    };
  };

  process.env.GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/mock/exec';
  delete process.env.OWNER_ORDER_EMAIL;
  process.chdir(tempDir);

  try {
    const result = await ownerNotification.notifyOwnerForPaidOrder(
      {
        log: {
          info() {},
          error() {}
        },
        plugin() {
          return null;
        }
      },
      {
        id: 42,
        order_number: 'ORD10042',
        createdAt: '2026-05-30T06:00:00.000Z',
        customer_name: 'Test Customer',
        customer_email: 'customer@example.com',
        customer_phone: '9876543210',
        shipping_address: '123 Test Street, Guwahati, Assam',
        items: [
          { name: 'Jeeva Gold Premium Tea', size: '250g x 2 Pack', quantity: 2 }
        ],
        subtotal_amount: 420,
        tax_amount: 0,
        shipping_amount: 0,
        total_amount: 420,
        payment_status: 'paid',
        razorpay_payment_id: 'pay_xyz123'
      }
    );

    assert.equal(result.sent, false);
    assert.match(result.error, /OWNER_ORDER_EMAIL/);
    assert.equal(postedPayload.order_number, 'ORD10042');
    assert.equal(postedPayload.payment_status, 'paid');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWebhookUrl === undefined) {
      delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    } else {
      process.env.GOOGLE_SHEETS_WEBHOOK_URL = originalWebhookUrl;
    }
    if (originalOwnerEmail === undefined) {
      delete process.env.OWNER_ORDER_EMAIL;
    } else {
      process.env.OWNER_ORDER_EMAIL = originalOwnerEmail;
    }
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
