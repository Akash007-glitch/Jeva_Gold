import { Buffer } from 'buffer';
import { buildOwnerOrderSummary } from './owner-notification';

const logInfo = (msg: string, ...args: any[]) => {
  if (typeof strapi !== 'undefined' && strapi.log) {
    strapi.log.info(`[WhatsApp Service] ${msg}`, ...args);
  } else {
    console.log(`[WhatsApp Service] ${msg}`, ...args);
  }
};

const logError = (msg: string, ...args: any[]) => {
  if (typeof strapi !== 'undefined' && strapi.log) {
    strapi.log.error(`[WhatsApp Service] ${msg}`, ...args);
  } else {
    console.error(`[WhatsApp Service] ${msg}`, ...args);
  }
};

/**
 * Normalizes phone numbers to E.164 standard.
 * - Removes non-digit characters.
 * - Prefixes 10-digit numbers with India's country code (+91) by default or custom configured code.
 * - Prepends '+' if not present.
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters except +
  let clean = phone.replace(/[^\d+]/g, '');
  
  if (clean.startsWith('+')) {
    return clean;
  }
  
  if (clean.startsWith('00')) {
    return '+' + clean.substring(2);
  }
  
  const defaultPrefix = process.env.DEFAULT_COUNTRY_CODE && process.env.DEFAULT_COUNTRY_CODE !== 'undefined'
    ? process.env.DEFAULT_COUNTRY_CODE
    : '+91';
  const cleanPrefix = defaultPrefix.startsWith('+') ? defaultPrefix : `+${defaultPrefix}`;

  // Indian phone number normalization: if starts with 0 and is 11 digits
  if (clean.length === 11 && clean.startsWith('0')) {
    return cleanPrefix + clean.substring(1);
  }
  
  // If it's a standard 10 digit number
  if (clean.length === 10) {
    return cleanPrefix + clean;
  }
  
  return '+' + clean;
};

const formatDate = (dateInput: any): string => {
  if (!dateInput) return new Date().toLocaleDateString('en-IN');
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? new Date().toLocaleDateString('en-IN') : d.toLocaleDateString('en-IN');
};

const formatCurrency = (amount: number): string => {
  return Number(amount || 0).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Dispatches a WhatsApp message using the configured provider.
 */
export const sendWhatsAppMessage = async (
  recipientPhone: string,
  messageText: string,
  options: {
    templateName?: string;
    templateParams?: string[];
  } = {}
): Promise<{ success: boolean; error?: string; response?: any }> => {
  const provider = (process.env.WHATSAPP_PROVIDER || 'none').toLowerCase().trim();
  const normalizedPhone = formatPhoneNumber(recipientPhone);

  if (!normalizedPhone) {
    return { success: false, error: 'Invalid or missing recipient phone number' };
  }

  logInfo(`Sending message via provider: '${provider}' to ${normalizedPhone}`);

  try {
    if (provider === 'none' || !provider) {
      logInfo(`[Simulation Mode] Message successfully logged:
To: ${normalizedPhone}
Message: ${messageText}
Template Name: ${options.templateName || 'N/A'}
Template Params: ${JSON.stringify(options.templateParams || [])}
`);
      return { success: true, response: { simulated: true } };
    }

    // 1. TWILIO PROVIDER
    if (provider === 'twilio') {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const sender = process.env.TWILIO_SENDER_NUMBER; // e.g. 'whatsapp:+14155238886'

      if (!accountSid || !authToken || !sender) {
        throw new Error('Twilio WhatsApp credentials (accountSid, authToken, or sender) are missing');
      }

      const formattedSender = sender.startsWith('whatsapp:') ? sender : `whatsapp:${sender}`;
      const formattedRecipient = `whatsapp:${normalizedPhone}`;

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const formData = new URLSearchParams();
      formData.append('From', formattedSender);
      formData.append('To', formattedRecipient);
      formData.append('Body', messageText);

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseText = await res.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (!res.ok) {
        throw new Error(
          `Twilio API error (Status ${res.status}): ${
            typeof responseData === 'object' ? JSON.stringify(responseData) : responseText
          }`
        );
      }

      logInfo(`Twilio message sent successfully to ${normalizedPhone}`);
      return { success: true, response: responseData };
    }

    // 2. META CLOUD API PROVIDER
    if (provider === 'meta') {
      const token = process.env.META_WHATSAPP_TOKEN;
      const phoneId = process.env.META_PHONE_NUMBER_ID;

      if (!token || !phoneId) {
        throw new Error('Meta WhatsApp Cloud API credentials (token or phoneId) are missing');
      }

      // Meta requires phone numbers without a leading +
      const metaRecipient = normalizedPhone.replace('+', '');
      const metaUrl = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

      let bodyPayload: any;

      if (options.templateName) {
        // Send as template message
        bodyPayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: metaRecipient,
          type: 'template',
          template: {
            name: options.templateName,
            language: {
              code: 'en_US',
            },
            components: options.templateParams && options.templateParams.length > 0 ? [
              {
                type: 'body',
                parameters: options.templateParams.map((val) => ({
                  type: 'text',
                  text: val,
                })),
              },
            ] : [],
          },
        };
      } else {
        // Send as free-form session message (requires active WhatsApp user window)
        bodyPayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: metaRecipient,
          type: 'text',
          text: {
            preview_url: false,
            body: messageText,
          },
        };
      }

      const res = await fetch(metaUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      const responseText = await res.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (!res.ok) {
        throw new Error(
          `Meta API error (Status ${res.status}): ${
            typeof responseData === 'object' ? JSON.stringify(responseData) : responseText
          }`
        );
      }

      logInfo(`Meta Cloud API message sent successfully to ${normalizedPhone}`);
      return { success: true, response: responseData };
    }

    // 3. CUSTOM PROVIDER (E.g. Ultramsg, Wati, custom webhook gateway)
    if (provider === 'custom') {
      const apiUrl = process.env.WHATSAPP_API_URL;
      const apiToken = process.env.WHATSAPP_API_TOKEN;

      if (!apiUrl) {
        throw new Error('Custom WhatsApp API URL is missing');
      }

      // Ultramsg style request: supports token auth & to, body params
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to: normalizedPhone,
          message: messageText,
          template: options.templateName,
          params: options.templateParams,
        }),
      });

      const responseText = await res.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (!res.ok) {
        throw new Error(
          `Custom API error (Status ${res.status}): ${
            typeof responseData === 'object' ? JSON.stringify(responseData) : responseText
          }`
        );
      }

      logInfo(`Custom API message sent successfully to ${normalizedPhone}`);
      return { success: true, response: responseData };
    }

    throw new Error(`Unsupported WhatsApp provider: ${provider}`);
  } catch (err: any) {
    logError(`Failed to send WhatsApp message to ${normalizedPhone}: ${err.message}`, err);
    return { success: false, error: err.message || 'Unknown error' };
  }
};

/**
 * Triggers order placed/payment successful notification.
 */
export const sendOrderPlacedMessage = async (order: any): Promise<boolean> => {
  const customerName = order.customer_name || 'Valued Customer';
  const orderId = order.id || '';
  const totalAmount = formatCurrency(order.total_amount);
  const dateStr = formatDate(order.paid_at || order.updatedAt || new Date());

  const messageText = `Hello ${customerName}, your order #${orderId} of ${totalAmount} has been placed successfully on ${dateStr}. Thank you for shopping with Jeeva Gold!`;

  // Meta parameters correspond to: CustomerName, OrderId, TotalAmount, Date
  const templateParams = [customerName, String(orderId), totalAmount, dateStr];
  const templateName = process.env.META_TEMPLATE_PLACED || 'order_placed';

  const result = await sendWhatsAppMessage(order.customer_phone, messageText, {
    templateName,
    templateParams,
  });

  return result.success;
};

/**
 * Triggers order dispatched notification.
 */
export const sendOrderDispatchedMessage = async (order: any): Promise<boolean> => {
  const customerName = order.customer_name || 'Valued Customer';
  const orderId = order.id || '';
  const dateStr = formatDate(new Date()); // Using current date as dispatch date
  
  const notesText = order.dispatch_notes ? ` Notes: ${order.dispatch_notes}.` : '';
  const messageText = `Hello ${customerName}, your order #${orderId} has been dispatched on ${dateStr}.${notesText} Thank you for shopping with Jeeva Gold!`;

  // Meta parameters correspond to: CustomerName, OrderId, Date, Notes
  const templateParams = [customerName, String(orderId), dateStr, order.dispatch_notes || 'None'];
  const templateName = process.env.META_TEMPLATE_DISPATCHED || 'order_dispatched';

  const result = await sendWhatsAppMessage(order.customer_phone, messageText, {
    templateName,
    templateParams,
  });

  return result.success;
};

/**
 * Triggers order paid notification to the store owner.
 */
export const sendOwnerOrderNotification = async (order: any): Promise<boolean> => {
  const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER;
  if (!ownerPhone) {
    logInfo('OWNER_WHATSAPP_NUMBER is not configured. Skipping owner WhatsApp notification.');
    return false;
  }

  const summary = buildOwnerOrderSummary(order);
  const messageText = `New Paid Order Received!\n\n${summary}`;

  // Meta template params correspond to: OrderId, CustomerName, TotalAmount, CustomerPhone
  const templateParams = [
    String(order.id || ''),
    order.customer_name || '',
    formatCurrency(order.total_amount),
    order.customer_phone || ''
  ];
  const templateName = process.env.META_TEMPLATE_OWNER_ALERT || 'owner_order_alert';

  const result = await sendWhatsAppMessage(ownerPhone, messageText, {
    templateName,
    templateParams,
  });

  return result.success;
};

