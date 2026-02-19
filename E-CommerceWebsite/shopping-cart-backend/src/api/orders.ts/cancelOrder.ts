import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productCategoryServices } from "../../services/prodCategoryServices";
import { placeOrderServices } from "../../services/placeOrderServices";

export const cancelOrdersHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.id as string;

    if (!id) {
      return h.response({ error: 'Invalid product ID' }).code(400);
    }

    const deletedID = await placeOrderServices.cancelOrder(id);
    if (!deletedID) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response({
      message: "Cancelled Order successfully",
      orderID: deletedID,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error"}).code(500);
  }
}