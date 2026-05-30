import fs from 'fs';
import path from 'path';

const formatINR = (amount: unknown) =>
  `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;

const formatItems = (items: any[] = []) =>
  items
    .map((item) => {
      const quantity = Number(item.quantity || item.qty || 1);
      const lineTotal = Number(item.price || 0) * quantity;
      return `- ${item.name} (${item.size || 'Standard Pack'}) x ${quantity} = ${formatINR(lineTotal)}`;
    })
    .join('\n');

export const buildOwnerOrderSummary = (order: any) => {
  const lines = [
    `Order #${order.order_number || order.id || 'pending'}`,
    `Payment status: ${order.payment_status || 'pending'}`,
    `Dispatch status: ${order.dispatch_status || 'pending_payment'}`,
    '',
    'Customer',
    `Name: ${order.customer_name}`,
    `Email: ${order.customer_email || 'N/A'}`,
    `Phone: ${order.customer_phone}`,
    '',
    'Shipping Address',
    order.shipping_address,
    '',
    'Items',
    formatItems(order.items),
    '',
    'Totals',
    `Subtotal: ${formatINR(order.subtotal_amount)}`,
    `Shipping: ${Number(order.shipping_amount || 0) === 0 ? 'Free' : formatINR(order.shipping_amount)}`,
    `Total: ${formatINR(order.total_amount)}`,
    '',
    'Payment',
    `Razorpay order: ${order.razorpay_order_id || '-'}`,
    `Razorpay payment: ${order.razorpay_payment_id || '-'}`,
  ];

  return lines.join('\n');
};

const escapeCSV = (str: string) => {
  if (!str) return '""';
  return `"${String(str).replace(/"/g, '""')}"`;
};

const generateOrderCSV = (order: any) => {
  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Shipping Address',
    'Items Ordered',
    'Subtotal Amount',
    'Tax Amount',
    'Shipping Amount',
    'Total Amount',
    'Payment Status',
    'Razorpay Payment ID'
  ];

  const itemDetails = (order.items || [])
    .map((item: any) => `${item.name} (${item.size || 'Standard'}) x ${item.quantity}`)
    .join('; ');

  const row = [
    order.order_number || `ORD${10000 + order.id}`,
    new Date(order.createdAt || Date.now()).toLocaleString('en-IN'),
    order.customer_name,
    order.customer_email || 'N/A',
    order.customer_phone,
    order.shipping_address,
    itemDetails,
    order.subtotal_amount,
    order.tax_amount,
    order.shipping_amount,
    order.total_amount,
    order.payment_status,
    order.razorpay_payment_id || 'N/A'
  ];

  const csvString = [
    headers.join('Status' in order ? ';' : ','),
    row.map(val => escapeCSV(String(val))).join('Status' in order ? ';' : ',')
  ].join('\n');

  return '\uFEFF' + csvString;
};

const appendToMasterCSV = (order: any) => {
  const csvPath = path.join(process.cwd(), 'orders.csv');
  const exists = fs.existsSync(csvPath);

  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Shipping Address',
    'Items Ordered',
    'Subtotal Amount',
    'Tax Amount',
    'Shipping Amount',
    'Total Amount',
    'Payment Status',
    'Razorpay Payment ID'
  ];

  const itemDetails = (order.items || [])
    .map((item: any) => `${item.name} (${item.size || 'Standard'}) x ${item.quantity}`)
    .join('; ');

  const row = [
    order.order_number || `ORD${10000 + order.id}`,
    new Date(order.createdAt || Date.now()).toLocaleString('en-IN'),
    order.customer_name,
    order.customer_email || 'N/A',
    order.customer_phone,
    order.shipping_address,
    itemDetails,
    order.subtotal_amount,
    order.tax_amount,
    order.shipping_amount,
    order.total_amount,
    order.payment_status,
    order.razorpay_payment_id || 'N/A'
  ];

  let csvContent = '';
  if (!exists) {
    csvContent += '\uFEFF' + headers.join(',') + '\n';
  }
  csvContent += row.map(val => escapeCSV(String(val))).join(',') + '\n';

  fs.appendFileSync(csvPath, csvContent, 'utf8');
};

export const syncToGoogleSheets = async (order: any) => {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    return { synced: false, reason: 'GOOGLE_SHEETS_WEBHOOK_URL is not configured' };
  }

  const items = order.items || [];
  const isSingleItem = items.length === 1;
  const singleItem = isSingleItem ? items[0] : null;

  const itemDetails = items
    .map((item: any) => `${item.name} (${item.size || 'StandardPack'}) x ${item.quantity}`)
    .join('; ');

  const payload = {
    order_number: order.order_number || `ORD${10000 + order.id}`,
    date: new Date(order.createdAt || Date.now()).toLocaleString('en-IN'),
    customer_name: order.customer_name,
    customer_email: order.customer_email || 'N/A',
    customer_phone: order.customer_phone,
    shipping_address: order.shipping_address,
    items: itemDetails,
    single_item_name: singleItem ? `${singleItem.name} (${singleItem.size || 'StandardPack'})` : itemDetails,
    single_item_qty: singleItem ? Number(singleItem.quantity || singleItem.qty || 1) : '',
    single_item_price: singleItem ? Number(singleItem.price || 0) : '',
    subtotal_amount: order.subtotal_amount,
    tax_amount: order.tax_amount,
    shipping_amount: order.shipping_amount,
    total_amount: order.total_amount,
    payment_status: order.payment_status,
    razorpay_payment_id: order.razorpay_payment_id || 'N/A'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { synced: true, data };
  } catch (error: any) {
    throw new Error(`Google Sheets sync failed: ${error?.message || error}`);
  }
};

export const notifyOwnerForPaidOrder = async (strapi: any, order: any) => {
  const to = process.env.OWNER_ORDER_EMAIL;
  const summary = buildOwnerOrderSummary(order);
  const csvContent = generateOrderCSV(order);

  try {
    appendToMasterCSV(order);
  } catch (csvErr) {
    strapi.log?.error?.('Failed to append to master orders.csv', csvErr);
  }

  try {
    const sheetsResult = await syncToGoogleSheets(order);
    if (!sheetsResult.synced) {
      strapi.log?.info?.(`Google Sheets not synced: ${sheetsResult.reason}`);
    } else {
      strapi.log?.info?.('Order synced to Google Sheets successfully');
    }
  } catch (sheetsErr) {
    strapi.log?.error?.('Failed to sync to Google Sheets', sheetsErr);
  }

  if (!to) {
    return {
      sent: false,
      error: 'OWNER_ORDER_EMAIL is not configured',
    };
  }

  const from = process.env.ORDER_NOTIFICATION_FROM_EMAIL || process.env.SMTP_DEFAULT_FROM || to;

  try {
    const emailService = strapi.plugin('email')?.service('email');

    if (!emailService?.send) {
      return {
        sent: false,
        error: 'Strapi email plugin is not configured',
      };
    }

    await emailService.send({
      to,
      from,
      subject: `Paid order ready to dispatch #${order.order_number || order.id}`,
      text: summary,
      attachments: [
        {
          filename: `order_${order.order_number || order.id}.csv`,
          content: csvContent,
          contentType: 'text/csv',
        }
      ]
    });

    return {
      sent: true,
      error: null,
    };
  } catch (error: any) {
    strapi.log?.error?.('Owner order notification failed', error);
    return {
      sent: false,
      error: error?.message || 'Owner order notification failed',
    };
  }
};
