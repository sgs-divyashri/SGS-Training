import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { productCategoryServices } from "../../services/prodCategoryServices";

export const getCategoryHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    
    const result = await productCategoryServices.getProductCategories();

    return h
      .response({
        message: "Retrieved products successfully",
        categories: result.items
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
