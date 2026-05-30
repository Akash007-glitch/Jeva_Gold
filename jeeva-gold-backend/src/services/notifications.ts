// Format tracking link
const getTrackingLink = (order: any) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${frontendUrl}/track/${order.order_number}?token=${order.tracking_token}`;
};

export const sendCustomerNotification = async (order: any, type: 'placed' | string) => {
  const customerName = order.customer_name;
  const orderNumber = order.order_number || `ORD${10000 + order.id}`;
  const trackingLink = getTrackingLink(order);

  let message = '';
  if (type === 'placed') {
    message = `Hi ${customerName}, your order ${orderNumber} has been successfully placed. Track your order here: ${trackingLink}`;
  } else {
    // For status updates e.g. "shipped", "packed", etc.
    const statusLabel = order.dispatch_status ? order.dispatch_status.toUpperCase() : 'UPDATED';
    message = `Hi ${customerName}, the status of your order ${orderNumber} has been updated to: ${statusLabel}. Track your order here: ${trackingLink}`;
  }

  // 1. Email Notification (if customer email is provided)
  if (order.customer_email) {
    const from = process.env.ORDER_NOTIFICATION_FROM_EMAIL || process.env.SMTP_DEFAULT_FROM || 'no-reply@jeevagold.com';
    try {
      // @ts-ignore
      const emailService = strapi.plugin('email')?.service('email');
      if (emailService?.send) {
        await emailService.send({
          to: order.customer_email,
          from,
          subject: type === 'placed' ? `Jeeva Gold Order Confirmed: ${orderNumber}` : `Jeeva Gold Order Update: ${orderNumber}`,
          text: message,
        });
        // @ts-ignore
        strapi.log.info(`Customer email confirmation sent to ${order.customer_email}`);
      }
    } catch (error: any) {
      // @ts-ignore
      strapi.log.error(`Email confirmation to customer failed: ${error.message}`);
    }
  }

  // 2. SMS Mock (always log it)
  // @ts-ignore
  strapi.log.info(`[SMS MOCK] Sending SMS to ${order.customer_phone}: "${message}"`);
};
