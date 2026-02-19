import { placeOrderRepository } from "../repository/placeOrdersRepo";
import { PlaceOrdersPayload } from "../models/ordersTableDefinition";
import { ViewOrdersPayload } from "../models/adminViewOrderNotifyTableDefinition";

export const placeOrderServices = {
  addPlaceOrder: async (
    payload: Pick<PlaceOrdersPayload, "orderedBy" | "totalAmount" | "items">
  ) => {
    const newOrder = await placeOrderRepository.addPlaceOrder(payload);
    return newOrder;
  },

  getAllOrders: async () => {
    const orders = await placeOrderRepository.getAllOrders();
    return orders;
  },

  getAdminStatus: async (userId: number) => {
    const status = await placeOrderRepository.getAdminStatus(userId);
    return status;
  },

  sendAdminStatus: async (id: string, payload: Pick<ViewOrdersPayload, "status">) => {
    const adminStatus = await placeOrderRepository.sendAdminStatus(id, payload);
    return adminStatus;
  },

  cancelOrder: async (id: string) => {
    const cancelledOrder = await placeOrderRepository.cancelOrder(id);
    return cancelledOrder;
  },

  deleteOrderNotification: async (id: string) => {
    const cancelledOrder = await placeOrderRepository.deleteOrderNotification(id);
    return cancelledOrder;
  }
};
