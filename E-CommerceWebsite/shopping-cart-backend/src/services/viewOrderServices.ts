import { viewOrderRepository } from "../repository/viewOrderRepo";
import { ViewOrdersPayload } from "../types/viewOrdersPayload";

export const viewOrderServices = {
  viewAllOrders: async (userId: number) => {
    const orders = await viewOrderRepository.viewAllOrders(userId);
    return orders;
  },

  sendAdminStatus: async (orderId: string, productId: string, status: "" | "ACCEPTED" | "REJECTED") => {
    const adminStatus = await viewOrderRepository.sendAdminStatus(orderId, productId, status);
    return adminStatus;
  },

  deleteAdminNotification: async (viewOrderId: string) => {
    const del = await viewOrderRepository.deleteAdminNotification(viewOrderId)
    return del;
  }
};
