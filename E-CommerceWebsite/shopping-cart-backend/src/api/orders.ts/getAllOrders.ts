import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { placeOrderServices } from "../../services/placeOrderServices";

export const getAllOrdersHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const result = await placeOrderServices.getAllOrders();

    return h
      .response({
        message: "Retrieved products successfully",
        orders: result.items
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
