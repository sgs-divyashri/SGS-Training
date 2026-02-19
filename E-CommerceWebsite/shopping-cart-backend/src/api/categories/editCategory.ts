import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { Category } from "../../models/prodCategoryTableDefinition";
import { productCategoryServices } from "../../services/prodCategoryServices";

export const editProductCtegoryHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const id = request.params.id;
    const payload = request.payload as Pick<Category, "prod_category">;

    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }

    const category = await Category.findOne({ where: { categoryId: id } });
    if (!category) return h.response({ error: "Product not found" }).code(404);

    const product = await productCategoryServices.editProductCategory(id, payload);

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
