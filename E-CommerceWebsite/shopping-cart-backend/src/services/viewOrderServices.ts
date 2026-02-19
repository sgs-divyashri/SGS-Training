import { viewOrderRepository } from "../repository/viewOrderRepo";
import { ViewOrdersPayload } from "../models/adminViewOrderNotifyTableDefinition";

export const viewOrderServices = {
  viewAllOrders: async () => {
    const orders = await viewOrderRepository.viewAllOrders();
    return orders;
  },

  editOrderStatus: async (id: string, payload: Pick<ViewOrdersPayload, "status">) => {
    const orders = await viewOrderRepository.editOrderStatus(id, payload);
    return orders;
  },
};
