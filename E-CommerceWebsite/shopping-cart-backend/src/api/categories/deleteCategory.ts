import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productCategoryServices } from "../../services/prodCategoryServices";
import { JWTPayload } from "../../authentication/authentication";
import { Category } from "../../models/prodCategoryTableDefinition";

export const deleteProductCategoryHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.id as string;

    if (!id) {
      return h.response({ error: 'Invalid product ID' }).code(400);
    }
    const { userId, role } = request.auth.credentials as Pick<JWTPayload, "userId" | "role">;
    const isAdmin = String(role ?? "").trim().toLowerCase() === "admin";

    if (!isAdmin) return h.response({ error: "Insufficient permissions" }).code(403);

    const category = await Category.findOne({ where: { categoryId: id, addedBy: userId } });
    if (!category) return h.response({ error: "Category not found" }).code(404);

    const deletedID = await productCategoryServices.deleteProductCategory(id, userId);
    if (!deletedID) {
      return h.response({ error: 'Product not found' }).code(404);
    }

    return h.response({
      message: "Deleted Product successfully",
      deletedID: deletedID,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
}