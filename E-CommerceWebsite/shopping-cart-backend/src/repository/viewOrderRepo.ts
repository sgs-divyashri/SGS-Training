import { Op } from "sequelize";
import {
  ViewOrders,
  ViewOrdersPayload,
} from "../models/adminViewOrderNotifyTableDefinition";
import { Product } from "../models/productTableDefinition";

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

  deleteAdminNotification: async (viewOrderId: string) => {
    const count = await ViewOrders.destroy({
      where: { viewOrderId }
    })
    return count > 0 ? viewOrderId : undefined
  }
};
