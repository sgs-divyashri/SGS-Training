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

  sendAdminStatus: async (orderId: string, productId: string, status: "" | "ACCEPTED" | "REJECTED") => {
    const orderView = await ViewOrders.findOne({ where: { orderId } });
    if (!orderView) return null;

    const items = orderView.get("items");
    const updated = items.map(it =>
      String(it.productId) === String(productId)
        ? { ...it, status }
        : it
    );

    if (status !== undefined) {
      await ViewOrders.update(
        { items: updated },
        { where: { orderId } },
      );
    }

    const updatedItem = updated.find((it) => String(it.productId) === String(productId));

    await NotifyUserOrders.create({
      notifyId: generateUserNotificationId(),
      orderId,
      items: [updatedItem!],
      // adminStatus: payload.status!,
      receivedAt: new Date()
    });

    return {
      orderId,
      productId,
      status,
      updatedItem
    };
  },

  deleteAdminNotification: async (viewOrderId: string) => {
    const count = await ViewOrders.destroy({
      where: { viewOrderId }
    })
    return count > 0 ? viewOrderId : undefined
  }
};
