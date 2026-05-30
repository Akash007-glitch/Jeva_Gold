import { sendCustomerNotification } from '../../../../services/notifications';

export default {
  async beforeUpdate(event: any) {
    const { where } = event.params;
    // @ts-ignore
    if (where && (where.id !== undefined || where.documentId !== undefined)) {
      try {
        // @ts-ignore
        const existing = await strapi.db.query('api::order.order').findOne({ where });
        if (existing) {
          event.state = { previousStatus: existing.dispatch_status };
        }
      } catch (err) {
        console.error('Error in order lifecycle beforeUpdate:', err);
      }
    }
  },

  async afterUpdate(event: any) {
    const { result, state } = event;
    const oldStatus = state?.previousStatus;
    const newStatus = result?.dispatch_status;

    if (oldStatus && newStatus && oldStatus !== newStatus) {
      // Status has changed! Notify the customer.
      try {
        await sendCustomerNotification(result, `status_${newStatus}`);
      } catch (err) {
        console.error('Failed to notify customer on status update:', err);
      }
    }
  }
};
