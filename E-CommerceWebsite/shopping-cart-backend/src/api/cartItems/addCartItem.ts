import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { cartItemsServices } from "../../services/cartItemsServices";
import { CartItemsPayload } from "../../types/cartItemsPayload";

export const addCartItemHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth?.credentials?.role ?? "").trim().toLowerCase();
    const authUserId = Number(request.auth?.credentials?.userId);
    if (role !== "user") return h.response({ error: "Insufficient permissions" }).code(403);

    const body = request.payload as Pick<CartItemsPayload, "productId" | "quantity">

    const cart = await cartItemsServices.addCartItem(body, authUserId);

    return h.response({
      message: "Cart created",
      cart
    }).code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
