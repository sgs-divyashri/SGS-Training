import { viewOrderRepository } from "../repository/viewOrderRepo";
import { ViewOrdersPayload } from "../types/viewOrdersPayload";

export const viewOrderServices = {
  viewAllOrders: async (userId: number) => {
    const orders = await viewOrderRepository.viewAllOrders(userId);
    return orders;
  },

  sendAdminStatus: async (id: string, payload: Pick<ViewOrdersPayload, "status">) => {
    const adminStatus = await viewOrderRepository.sendAdminStatus(id, payload);
    return adminStatus;
  },

  deleteAdminNotification: async (viewOrderId: string) => {
    const del = await viewOrderRepository.deleteAdminNotification(viewOrderId)
    return del;
  }
};
