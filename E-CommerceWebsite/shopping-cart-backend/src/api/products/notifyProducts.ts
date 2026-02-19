import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";

export const notifyProductHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const id = request.params.productID;

    if (!id) {
      return h.response({ error: "Invalid product ID" }).code(400);
    }

    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }

    const prod = await productServices.notifyProduct(id);
    if (prod === null) {
      return h.response({ error: "Product not found" }).code(404);
    }

    return h
      .response({
        message: "Changed Notifications successfully",
        product: prod,
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error"}).code(500);
  }
};
