import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Product } from "../../models/productTableDefinition";
import { productServices } from "../../services/productServices";
import { Category } from "../../models/prodCategoryTableDefinition";
import { Op } from "sequelize";

export const editProductHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const id = request.params.id;
    const payload = request.payload as Pick<
      Partial<Product>,
      "p_name" | "p_description" | "categoryId" | "price" | "qty"
    >;
    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    const prod = await Product.findOne({ where: { productId: id } });
    if (!prod) return h.response({ error: "Product not found" }).code(404);

    if (payload.price !== undefined) {
      const priceNum =
        typeof payload.price === "string"
          ? Number(payload.price)
          : payload.price;

      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return h.response({ error: "Invalid Price" }).code(400);
      }
      payload.price = priceNum;
    }

    const product = await productServices.editProduct(id, payload);

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
