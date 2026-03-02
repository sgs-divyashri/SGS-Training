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
  addPlaceOrder: async (
    payload: Pick<PlaceOrdersPayload, "orderedBy" | "items">
  ) => {
    // 1) Basic validation (unchanged logic)
    if (
      !payload?.orderedBy ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0
    ) {
      throw new Error("Invalid payload");
    }

    const invalid = payload.items.some(
      (i) => !i.productId || !i.quantity || i.quantity <= 0,
    );
    if (invalid) throw new Error("Invalid item in payload");

    // 2) Bulk load product data ONCE
    const productIds = payload.items.map((i) => i.productId);
    const products = await Product.findAll({
      where: { productId: { [Op.in]: productIds } },
      attributes: ["productId", "p_name", "price", "qty"],
    });
    const prodMap = new Map(products.map(p => [String(p.get("productId")), p]));

    // 3) Enrich each item (prodName, price) and normalize quantity
    const detailedItems: ProductItems[] = payload.items.map(({ productId, quantity }) => {
      const prod = prodMap.get(String(productId));
      if (!prod) throw new Error(`Product ${productId} not found`);
      return {
        productId: String(productId),
        prodName: String(prod.get("p_name")),
        price: Number(prod.get("price")),
        quantity: Number(quantity),
        // total_quantity: Number(prod.get("qty"))
      };
    });

    // 4) Compute totalAmount (authoritative in service)
    const totalAmount = detailedItems.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.quantity),
      0,
    );

    // 5) Stock check & decrement (unchanged logic, centralized)
    for (const item of detailedItems) {
      const prod = prodMap.get(item.productId)!; // exists by validation above
      const currentQty = Number(prod.get("qty"));
      const newQty = currentQty - item.quantity;
      if (newQty < 0) {
        throw new Error(`Insufficient stock for ${item.productId}`);
      }
      await Product.update(
        { qty: newQty, inStock: newQty > 0 ? "In Stock" : "Out of Stock" },
        { where: { productId: item.productId } },
      );
    }

    // 6) Persist order + view order
    const orderId = generateOrderId();
    const viewOrderId = generateViewOrderId();

    await Orders.create({
      orderId,
      orderedBy: payload.orderedBy,
      items: detailedItems,
      totalAmount,
      status: "ORDERED",
    });

    const viewOrder = await ViewOrders.create({
      viewOrderId,
      orderId,
      orderedBy: payload.orderedBy,
      items: detailedItems,
      totalAmount,
      status: "",
      userStatus: "ORDERED",
    });

    // 7) Return summary
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

  sendAdminStatus: async (
    viewOrderId: string,
    payload: Pick<ViewOrdersPayload, "status">,
  ) => {
    const orderView = await ViewOrders.findOne({ where: { viewOrderId } });
    if (!orderView) return null;

    const orderId = orderView.get("orderId");

    const order = await Orders.findOne({ where: { orderId } });
    if (!order) return null;

    const items = order.get("items");

    if (payload.status !== undefined) {
      // await Orders.update(
      //   { adminStatus: payload.status! },
      //   { where: { orderId } },
      // );
      console.log("NotifyUserOrders table:", (NotifyUserOrders as any).getTableName());

      await ViewOrders.update(
        { status: payload.status! },
        { where: { viewOrderId } },
      );
    }

    const created = await NotifyUserOrders.create({
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

  getAdminStatus: async (userId: number) => {
    const rows = await Orders.findAll({
      where: { orderedBy: userId },
      attributes: [
        "orderId",
        "items",
        "totalAmount",
        "placedAt",
        "status",
      ],
      order: [["placedAt", "DESC"]],
    });
    return rows;
  },

  cancelOrder: async (orderId: string) => {
    const order = await Orders.findOne({
      where: { orderId },
      attributes: ["orderId", "status", "items"],
    });

    if (!order) return undefined;

    const currentStatus = String(order.get("status") || "");
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
      const items = (order.get("items") as any[]) || [];
      for (const it of items) {
        const productId = String(it.productId);
        const qtyToAdd = Number(it.quantity) || 0;
        if (!productId || qtyToAdd <= 0) continue;

        const prod = await Product.findOne({
          where: { productId },
          attributes: ["productId", "qty"],
        });

        if (!prod) continue;

        const currentQty = Number(prod.get("qty")) || 0;
        const newQty = currentQty + qtyToAdd;

        await Product.update(
          {
            qty: newQty,
            inStock: newQty > 0 ? "In Stock" : "Out of Stock",
          },
          { where: { productId } },
        );
      }
    }

    return affected1 + affected2 > 0 ? orderId : undefined;
  },

  deleteOrderNotification: async (id: string) => {
    const viewOrderCount = await ViewOrders.destroy({
      where: { orderId: id },
    });

    const userCount = await Orders.destroy({ where: { orderId: id } });
    return userCount + viewOrderCount > 0 ? id : undefined;
  },
};
