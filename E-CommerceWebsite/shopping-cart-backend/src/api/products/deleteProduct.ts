import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { Product } from "../../models/productTableDefinition";
import { JWTPayload } from "../../authentication/authentication";

export const deleteProductHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.id as string;

    if (!id) {
      return h.response({ error: 'Invalid product ID' }).code(400);
    }
    const { userId, role } = request.auth.credentials as Pick<JWTPayload, "userId" | "role">;
    const isAdmin = String(role ?? "").trim().toLowerCase() === "admin";

    if (!isAdmin) return h.response({ error: "Insufficient permissions" }).code(403);

    const category = await Product.findOne({ where: { productId: id, addedBy: userId } });
    if (!category) return h.response({ error: "Category not found" }).code(404);

    const deletedID = await productServices.deleteProduct(id, userId);
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