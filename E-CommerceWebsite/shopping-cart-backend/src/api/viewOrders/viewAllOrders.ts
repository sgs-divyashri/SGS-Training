import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { placeOrderServices } from "../../services/placeOrderServices";
import { viewOrderServices } from "../../services/viewOrderServices";

export const viewAllOrdersHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const result = await viewOrderServices.viewAllOrders();

    return h
      .response({
        message: "Retrieved orders successfully",
        orders: result.items
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
