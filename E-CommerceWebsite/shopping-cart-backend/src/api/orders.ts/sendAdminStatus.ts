import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { Category } from "../../models/prodCategoryTableDefinition";
import { productCategoryServices } from "../../services/prodCategoryServices";
import { ViewOrders, ViewOrdersPayload } from "../../models/adminViewOrderNotifyTableDefinition";
import { placeOrderServices } from "../../services/placeOrderServices";

export const sendAdminStatusHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const id = request.params.id;
    const payload = request.payload as Pick<ViewOrdersPayload, "status">;

    const category = await ViewOrders.findOne({ where: { viewOrderId: id } });
    if (!category) return h.response({ error: "Product not found" }).code(404);

    const product = await placeOrderServices.sendAdminStatus(id, payload);

    return h
      .response({
        message: "Edited Product successfully",
        product: product,
      })
      .code(200);
  } catch (err: any) {
    console.error("ERROR:", err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
