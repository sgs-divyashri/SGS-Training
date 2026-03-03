import { placeOrderRepository } from "../repository/placeOrdersRepo";
import { PlaceOrdersPayload } from "../types/placeOrdersPayload";

export const placeOrderServices = {
  addPlaceOrder: async (payload: Pick<PlaceOrdersPayload, "items">, orderedBy: number) => {
    const newOrder = await placeOrderRepository.addPlaceOrder(payload, orderedBy);
    return newOrder;
  },

  getAllOrders: async () => {
    const orders = await placeOrderRepository.getAllOrders();
    return orders;
  },

  cancelOrder: async (id: string) => {
    const cancelledOrder = await placeOrderRepository.cancelOrder(id);
    return cancelledOrder;
  },

  deleteOrder: async (id: string) => {
    const delOrder = await placeOrderRepository.deleteOrder(id)
    return delOrder;
  },
};
