import { Orders, PlaceOrdersPayload } from "../models/ordersTableDefinition";
import generateOrderId from "../services/generateOrderId";
import { CartItems } from "../models/cartItemsTableDefinition";
import {
  ViewOrders,
  ViewOrdersPayload,
} from "../models/adminViewOrderNotifyTableDefinition";
import generateViewOrderId from "../services/generateViewOrderId";

export const viewOrderRepository = {
  viewAllOrders: async () => {
    const { rows } = await ViewOrders.findAndCountAll({
      order: [["receivedAt", "DESC"]],
    });

    return { items: rows };
  },

  editOrderStatus: async (
    id: string,
    payload: Pick<ViewOrdersPayload, "status">,
  ) => {
    const product = await ViewOrders.findOne({ where: { viewOrderId: id } });
    if (!product) return null;

    if (payload.status !== undefined) product.set("status", payload.status);

    await product.save();
    return product.get();
  },

  //   cancelOrder: async (id: string) => {
  //     const count = await Orders.destroy({ where: { orderId: id } });
  //     return count > 0 ? id : undefined;
  //   },
};
