import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { placeOrderServices } from "../../services/placeOrderServices";
import { PlaceOrdersPayload } from "../../models/ordersTableDefinition";
import { User } from "../../models/userTableDefinition";
import { Op } from "sequelize";
import { Product } from "../../models/productTableDefinition";

type AddOrder = {
  orderedBy: number;
  items: Array<{ productId: string; quantity: number }>;
};

export const addPlaceOrderHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<
      PlaceOrdersPayload,
      "orderedBy" | "totalAmount" | "items"
    >;
    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "user") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    const body = request.payload as AddOrder;

    if (
      !body.orderedBy ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const existing = await User.findOne({
      where: {
        userId: payload.orderedBy,
      },
      attributes: ["userId", "email"],
    });
    if (!existing) {
      return h
        .response({
          error: `User ID: ${payload.orderedBy} not found`,
        })
        .code(404);
    }

    const orderItems: {
      productId: string;
      prodName: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const row of body.items) {
      if (!row.productId || !row.quantity || row.quantity <= 0) {
        return h.response({ error: "Invalid item in payload" }).code(400);
      }

      const existingProd = await Product.findOne({
        where: { productId: row.productId },
        attributes: ["productId", "p_name", "price"],
      });
      if (!existingProd) {
        return h
          .response({
            error: `${row.productId} not found`,
          })
          .code(404);
      }

      orderItems.push({
        productId: row.productId,
        prodName: existingProd.p_name,
        price: Number(existingProd.price),
        quantity: Number(row.quantity),
      });
    }

    const totalAmount = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const newOrder = await placeOrderServices.addPlaceOrder({
      items: orderItems,
      orderedBy: body.orderedBy,
      totalAmount,
    });

    return h
      .response({
        message: "Inserted successfully!",
        orderID: newOrder.orderId,
        totalAmount: Number(newOrder.totalAmount),
        itemsCount: orderItems.length,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
