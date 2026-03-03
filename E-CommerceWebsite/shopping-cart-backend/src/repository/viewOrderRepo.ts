import { Op } from "sequelize";
import { ViewOrders } from "../models/adminViewOrderNotifyTableDefinition";
import { ViewOrdersPayload } from "../types/viewOrdersPayload";
import { Product } from "../models/productTableDefinition";
import { NotifyUserOrders } from "../models/userNotificationTableDefinition";
import { Orders } from "../models/ordersTableDefinition";
import generateUserNotificationId from "../services/generateUserNotificationID";

export const viewOrderRepository = {
  viewAllOrders: async (adminId: number) => {
    const prods = await Product.findAll({
      where: { addedBy: adminId },
      attributes: ["productId"],
      raw: true,
    });

    const ids = prods.map(p => p.productId);

    if (ids.length === 0) {
      return { items: [], total: 0 };
    }

    const orConditions = ids.map(id => ({
      items: { [Op.contains]: [{ productId: id }] },
    }));

    const { rows } = await ViewOrders.findAndCountAll({
      where: { [Op.or]: orConditions },
      order: [["receivedAt", "DESC"]],
    });

    return { items: rows };
  },

  sendAdminStatus: async (viewOrderId: string, payload: Pick<ViewOrdersPayload, "status">) => {
    const orderView = await ViewOrders.findOne({ where: { viewOrderId } });
    if (!orderView) return null;

    const orderId = orderView.get("orderId");

    const order = await Orders.findOne({ where: { orderId } });
    if (!order) return null;

    const items = order.get("items");

    if (payload.status !== undefined) {
      await ViewOrders.update(
        { status: payload.status! },
        { where: { viewOrderId } },
      );
    }

    await NotifyUserOrders.create({
      notifyId: generateUserNotificationId(),
      orderId,
      items,                
      adminStatus: payload.status!,  
      receivedAt: new Date()
    });

    return {
      viewOrderId,
      orderId,
      status: payload.status,
    };
  },

  deleteAdminNotification: async (viewOrderId: string) => {
    const count = await ViewOrders.destroy({
      where: { viewOrderId }
    })
    return count > 0 ? viewOrderId : undefined
  }
};
