import { viewOrderRepository } from "../repository/viewOrderRepo";
import { ViewOrdersPayload } from "../models/adminViewOrderNotifyTableDefinition";

export const viewOrderServices = {
  viewAllOrders: async (userId: number) => {
    const orders = await viewOrderRepository.viewAllOrders(userId);
    return orders;
  },

  editOrderStatus: async (id: string, payload: Pick<ViewOrdersPayload, "status">) => {
    const orders = await viewOrderRepository.editOrderStatus(id, payload);
    return orders;
  },

  deleteAdminNotification: async (viewOrderId: string) => {
    const del = await viewOrderRepository.deleteAdminNotification(viewOrderId)
    return del;
  }
};
