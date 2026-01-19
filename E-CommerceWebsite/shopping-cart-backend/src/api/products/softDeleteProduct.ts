import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";

export const delAndResProductHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.productID;

    if (!id) {
      return h.response({ error: 'Invalid product ID' }).code(400);
    }

    const prod = await productServices.delAndResProduct(id);
    if (prod === null) {
      return h.response({ error: 'Product not found' }).code(404);
    }

    return h.response({
      message: "Soft Deleted or Restored Product successfully",
      product: prod,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }
}