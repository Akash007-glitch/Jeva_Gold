import { sendOrderPlacedMessage, sendOrderDispatchedMessage, sendOwnerOrderNotification } from '../../services/whatsapp';

export default {
  async beforeUpdate(event: any) {
    const { params } = event;
    if (params.where && params.where.id) {
      try {
        // Fetch current state of the order to track changes in status fields
        const existing = await strapi.db.query('api::order.order').findOne({
          where: { id: params.where.id }
        });
        if (existing) {
          event.state = {
            previousPaymentStatus: existing.payment_status,
            previousDispatchStatus: existing.dispatch_status,
          };
        }
      } catch (err) {
        if (typeof strapi !== 'undefined' && strapi.log) {
          strapi.log.error('Error fetching order state in beforeUpdate lifecycle', err);
        } else {
          console.error('Error fetching order state in beforeUpdate lifecycle', err);
        }
      }
    }
  },

  async afterUpdate(event: any) {
    const { result, state } = event;
    if (!state) return;

    const previousPaymentStatus = state.previousPaymentStatus;
    const currentPaymentStatus = result.payment_status;

    const previousDispatchStatus = state.previousDispatchStatus;
    const currentDispatchStatus = result.dispatch_status;

    // 1. Payment status changed to 'paid' (Order Placed)
    if (previousPaymentStatus !== 'paid' && currentPaymentStatus === 'paid') {
      try {
        if (typeof strapi !== 'undefined' && strapi.log) {
          strapi.log.info(`Order #${result.id} payment status transitioned to paid. Triggering WhatsApp messages.`);
        }
        await sendOrderPlacedMessage(result);
        
        // Also notify store owner
        try {
          await sendOwnerOrderNotification(result);
        } catch (ownerErr) {
          if (typeof strapi !== 'undefined' && strapi.log) {
            strapi.log.error(`Failed to send owner paid notification WhatsApp for order #${result.id}`, ownerErr);
          } else {
            console.error(`Failed to send owner paid notification WhatsApp for order #${result.id}`, ownerErr);
          }
        }
      } catch (err) {
        if (typeof strapi !== 'undefined' && strapi.log) {
          strapi.log.error(`Failed to send order placed WhatsApp notification for order #${result.id}`, err);
        } else {
          console.error(`Failed to send order placed WhatsApp notification for order #${result.id}`, err);
        }
      }
    }

    // 2. Dispatch status changed to 'dispatched' (Order Dispatched)
    if (previousDispatchStatus !== 'dispatched' && currentDispatchStatus === 'dispatched') {
      try {
        if (typeof strapi !== 'undefined' && strapi.log) {
          strapi.log.info(`Order #${result.id} dispatch status transitioned to dispatched. Triggering WhatsApp message.`);
        }
        await sendOrderDispatchedMessage(result);
      } catch (err) {
        if (typeof strapi !== 'undefined' && strapi.log) {
          strapi.log.error(`Failed to send order dispatched WhatsApp notification for order #${result.id}`, err);
        } else {
          console.error(`Failed to send order dispatched WhatsApp notification for order #${result.id}`, err);
        }
      }
    }
  }
};
