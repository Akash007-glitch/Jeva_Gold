const axios = require('axios');

const sendOrderConfirmation = async ({ customerName, customerPhone, orderId, amount }) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  let phone = String(customerPhone || '').replace(/\D/g, '');

  if (!phone.startsWith('91')) {
    phone = `91${phone}`;
  }

  if (!token || !phoneNumberId) {
    strapi.log.error('WhatsApp order confirmation failed: missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: 'hello_world',
          language: {
            code: 'en_US',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    strapi.log.info(`WhatsApp order confirmation sent to ${phone}`);
  } catch (error) {
    strapi.log.error('WhatsApp order confirmation failed', {
      phone,
      orderId,
      customerName,
      amount,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }
};

module.exports = {
  sendOrderConfirmation,
};
