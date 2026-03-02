import { notifyOrdersRepository } from "../repository/userOrderNotificationRepo";

export const notifyOrderServices = {
  getAllOrderNotifications: async () => {
    const orders = await notifyOrdersRepository.getAllOrderNotifications();
    return orders;
  },

  deleteOrderNotification: async (id: string) => {
    const orders = await notifyOrdersRepository.deleteOrderNotification(id);
    return orders;
  },
};
