import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { cartItemsServices } from "../../services/cartItemsServices";

export const getAllCartItemsHandler = async (
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
    
    const result = await cartItemsServices.getAllCartItems();

    return h
      .response({
        message: "Retrieved products successfully",
        cartItems: result.items,
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
