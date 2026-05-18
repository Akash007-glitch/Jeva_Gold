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
    `Order #${order.id || 'pending'}`,
    `Payment status: ${order.payment_status || 'pending'}`,
    `Dispatch status: ${order.dispatch_status || 'pending_payment'}`,
    '',
    'Customer',
    `Name: ${order.customer_name}`,
    `Email: ${order.customer_email}`,
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
    // `GST: ${formatINR(order.tax_amount)}`,
    `Shipping: ${Number(order.shipping_amount || 0) === 0 ? 'Free' : formatINR(order.shipping_amount)}`,
    `Total: ${formatINR(order.total_amount)}`,
    '',
    'Payment',
    `Razorpay order: ${order.razorpay_order_id || '-'}`,
    `Razorpay payment: ${order.razorpay_payment_id || '-'}`,
  ];

  return lines.join('\n');
};

export const notifyOwnerForPaidOrder = async (strapi: any, order: any) => {
  const to = process.env.OWNER_ORDER_EMAIL;

  if (!to) {
    return {
      sent: false,
      error: 'OWNER_ORDER_EMAIL is not configured',
    };
  }

  const summary = buildOwnerOrderSummary(order);
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
      subject: `Paid order ready to dispatch #${order.id}`,
      text: summary,
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
