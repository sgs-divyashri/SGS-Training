import { Op } from "sequelize";
import {
  ViewOrders,
  ViewOrdersPayload,
} from "../models/adminViewOrderNotifyTableDefinition";
import { Product } from "../models/productTableDefinition";
import { NotifyUserOrders } from "../models/userNotificationTableDefinition";

export const notifyOrdersRepository = {
  getAllOrderNotifications: async () => {
    const prods = await Product.findAll({
      attributes: ["productId"],
      raw: true,
    });

    const ids = prods.map(p => p.productId);

    if (ids.length === 0) {
      return { items: [] };
    }

    const orConditions = ids.map(id => ({
      items: { [Op.contains]: [{ productId: id }] },
    }));

    const { rows } = await NotifyUserOrders.findAndCountAll({
      where: { [Op.or]: orConditions },
      order: [["receivedAt", "DESC"]],
    });

    return { items: rows };
  },

  deleteOrderNotification: async (notifyId: string) => {
    const count = await NotifyUserOrders.destroy({
        where: {notifyId}
    })
    return count > 0 ? notifyId : undefined
  }
};
