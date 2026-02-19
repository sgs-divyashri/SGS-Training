import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { Category } from "../../models/prodCategoryTableDefinition";
import { productCategoryServices } from "../../services/prodCategoryServices";
import { ViewOrders, ViewOrdersPayload } from "../../models/adminViewOrderNotifyTableDefinition";
import { viewOrderServices } from "../../services/viewOrderServices";

export const editViewOrderStatusHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const id = request.params.id;
    const payload = request.payload as Pick<ViewOrdersPayload, "status">;

    const category = await ViewOrders.findOne({ where: { viewOrderId: id } });
    if (!category) return h.response({ error: "Order not found" }).code(404);

    const product = await viewOrderServices.editOrderStatus(id, payload);

    return h
      .response({
        message: "Edited Order successfully",
        product: product,
      })
      .code(200);
  } catch (err: any) {
    console.error("ERROR:", err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
