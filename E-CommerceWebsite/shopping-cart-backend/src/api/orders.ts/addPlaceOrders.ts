import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { placeOrderServices } from "../../services/placeOrderServices";
import { error } from "node:console";

type AddOrder = {
  items: Array<{ productId: string; quantity: number }>;
};

export const addPlaceOrderHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();
    if (role !== "user") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    const orderedBy = Number(request.auth.credentials.userId);
    const payload = request.payload as AddOrder;

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const invalid = payload.items.some(
      (i) => !i.productId || !i.quantity || i.quantity <= 0,
    );
    if (invalid) {
      return h.response({ error: "Invalid item in payload"})
    }

    const result = await placeOrderServices.addPlaceOrder({
      items: payload.items,
    }, orderedBy);

    return h.response({
      message: "Inserted successfully!",
      orderID: result.orderId,
      totalAmount: Number(result.totalAmount),
      itemsCount: result.itemsCount,
    }).code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
