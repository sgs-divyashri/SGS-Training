import { Orders } from "../models/ordersTableDefinition";
import { ViewOrders } from "../models/adminViewOrderNotifyTableDefinition";
import { Product } from "../models/productTableDefinition";
import { Op, where } from "sequelize";
import { ViewOrdersPayload } from "../types/viewOrdersPayload";
import generateOrderId from "../services/generateOrderId";
import generateViewOrderId from "../services/generateViewOrderId";
import { NotifyUserOrders } from "../models/userNotificationTableDefinition";
import generateUserNotificationId from "../services/generateUserNotificationID";
import { PlaceOrdersPayload } from "../types/placeOrdersPayload";
import { ProductItems } from "../types/productItems";
import { OrderItems } from "../types/orderItems";

export const placeOrderRepository = {
  addPlaceOrder: async (payload: Pick<PlaceOrdersPayload, "items">, orderedBy: number) => {
    const productIds = payload.items.map((i) => i.productId);
    const products = await Product.findAll({
      where: { productId: { [Op.in]: productIds } },
      attributes: ["productId", "p_name", "price", "total_quantity"],
    });
    const prodMap = new Map(products.map(p => [String(p.get("productId")), p]));

    const detailedItems: ProductItems[] = payload.items.map(({ productId, quantity }) => {
      const prod = prodMap.get(String(productId));
      if (!prod) throw new Error(`Product ${productId} not found`);
      return {
        productId: String(productId),
        prodName: String(prod.get("p_name")),
        price: Number(prod.get("price")),
        quantity: Number(quantity),
      };
    });

    const totalAmount = detailedItems.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.quantity),
      0,
    );

    for (const item of detailedItems) {
      const prod = prodMap.get(item.productId)!; 
      const currentQty = Number(prod.get("total_quantity"));
      const newQty = currentQty - item.quantity;
      if (newQty < 0) {
        throw new Error(`Insufficient stock for ${item.productId}`);
      }
      await Product.update(
        { total_quantity: newQty, inStock: newQty > 0 ? "In Stock" : "Out of Stock" },
        { where: { productId: item.productId } },
      );
    }

    const orderId = generateOrderId();
    const viewOrderId = generateViewOrderId();

    await Orders.create({
      orderId,
      orderedBy,
      items: detailedItems,
      totalAmount,
      status: "ORDERED",
    });

    const viewOrder = await ViewOrders.create({
      viewOrderId,
      orderId,
      orderedBy,
      items: detailedItems,
      totalAmount,
      userStatus: "ORDERED",
    });

    return {
      orderId,
      viewOrderId: viewOrder.get("viewOrderId"),
      totalAmount,
      itemsCount: detailedItems.length,
    };
  },

  getAllOrders: async () => {
    const { rows } = await Orders.findAndCountAll({
      order: [["placedAt", "DESC"]],
    });
    return { items: rows };
  },

  cancelOrder: async (orderId: string) => {
    const order = await Orders.findOne({
      where: { orderId },
      attributes: ["orderId", "status", "items"],
    });

    if (!order) return undefined;

    const currentStatus = String(order.status || "");
    const restockableStatuses = new Set(["ORDERED", "CANCELLED"]);
    const shouldRestock = restockableStatuses.has(currentStatus);

    const [affected1] = await Orders.update(
      { status: "CANCELLED" },
      { where: { orderId, status: currentStatus } },
    );
    const [affected2] = await ViewOrders.update(
      { userStatus: "CANCELLED" },
      { where: { orderId } },
    );

    if (affected1 === 0) {
      return undefined;
    }

    if (shouldRestock) {
      const items = (order.items as any[]) || [];
      for (const it of items) {
        const productId = String(it.productId);
        const qtyToAdd = Number(it.quantity) || 0;
        if (!productId || qtyToAdd <= 0) continue;

        const prod = await Product.findOne({
          where: { productId },
          attributes: ["productId", "total_quantity"],
        });

        if (!prod) continue;

        const currentQty = Number(prod.total_quantity) || 0;
        const newQty = currentQty + qtyToAdd;

        await Product.update(
          {
            total_quantity: newQty,
            inStock: newQty > 0 ? "In Stock" : "Out of Stock",
          },
          { where: { productId } },
        );
      }
    }

    return affected1 + affected2 > 0 ? orderId : undefined;
  },

  deleteOrder: async (id: string) => {
    const delOrder = await Orders.destroy({ where: { orderId: id}})
    return delOrder;
  }
};
