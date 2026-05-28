const assert = require('node:assert/strict');
const test = require('node:test');

const whatsapp = require('../dist/src/api/order/services/whatsapp.js');

test('formats phone numbers to E.164 standard', () => {
  // Save original default country code
  const originalCountryCode = process.env.DEFAULT_COUNTRY_CODE;

  // Indian number without prefix
  process.env.DEFAULT_COUNTRY_CODE = '+91';
  assert.equal(whatsapp.formatPhoneNumber('9876543210'), '+919876543210');

  // Indian number with 0 prefix
  assert.equal(whatsapp.formatPhoneNumber('09876543210'), '+919876543210');

  // Number with spaces, dashes, parentheses
  assert.equal(whatsapp.formatPhoneNumber('+91 98765-43210'), '+919876543210');

  // Custom prefix (e.g. USA)
  process.env.DEFAULT_COUNTRY_CODE = '+1';
  assert.equal(whatsapp.formatPhoneNumber('2025550143'), '+12025550143');

  // Restore original country code
  if (originalCountryCode === undefined) {
    delete process.env.DEFAULT_COUNTRY_CODE;
  } else {
    process.env.DEFAULT_COUNTRY_CODE = originalCountryCode;
  }
});

test('handles whatsapp send in simulation mode', async () => {
  const originalProvider = process.env.WHATSAPP_PROVIDER;
  process.env.WHATSAPP_PROVIDER = 'none';

  const result = await whatsapp.sendWhatsAppMessage('9876543210', 'Test message');
  assert.equal(result.success, true);
  assert.equal(result.response.simulated, true);

  process.env.WHATSAPP_PROVIDER = originalProvider;
});

test('sends order placed message in simulation mode', async () => {
  const originalProvider = process.env.WHATSAPP_PROVIDER;
  process.env.WHATSAPP_PROVIDER = 'none';

  const order = {
    id: 123,
    customer_name: 'Test Customer',
    customer_phone: '9876543210',
    total_amount: 540,
    paid_at: new Date('2026-05-28T12:00:00.000Z'),
  };
  const result = await whatsapp.sendOrderPlacedMessage(order);
  assert.equal(result, true);

  process.env.WHATSAPP_PROVIDER = originalProvider;
});

test('sends order dispatched message in simulation mode', async () => {
  const originalProvider = process.env.WHATSAPP_PROVIDER;
  process.env.WHATSAPP_PROVIDER = 'none';

  const order = {
    id: 123,
    customer_name: 'Test Customer',
    customer_phone: '9876543210',
    dispatch_notes: 'Shipped via DTDC',
  };
  const result = await whatsapp.sendOrderDispatchedMessage(order);
  assert.equal(result, true);

  process.env.WHATSAPP_PROVIDER = originalProvider;
});

test('sends owner paid notification message in simulation mode', async () => {
  const originalProvider = process.env.WHATSAPP_PROVIDER;
  const originalOwnerPhone = process.env.OWNER_WHATSAPP_NUMBER;
  
  process.env.WHATSAPP_PROVIDER = 'none';
  process.env.OWNER_WHATSAPP_NUMBER = '9876543210';

  const order = {
    id: 123,
    payment_status: 'paid',
    dispatch_status: 'ready_to_dispatch',
    customer_name: 'Test Customer',
    customer_email: 'customer@example.com',
    customer_phone: '9876543210',
    shipping_address: '123 Test Street, Guwahati, Assam',
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
  };
  
  const result = await whatsapp.sendOwnerOrderNotification(order);
  assert.equal(result, true);

  process.env.WHATSAPP_PROVIDER = originalProvider;
  process.env.OWNER_WHATSAPP_NUMBER = originalOwnerPhone;
});

