import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { ProductPayload } from "../../models/productTableDefinition";
import { Category } from "../../models/prodCategoryTableDefinition";

export const addProductHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<
      ProductPayload,
      "p_name" | "p_description" | "categoryId" | "price" | "qty"
    >;

    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }

    if (
      !payload.p_name ||
      !payload.p_description ||
      !payload.categoryId ||
      !payload.price
    ) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const category = await Category.findOne({
      where: { prod_category: payload.categoryId },
      attributes: ["categoryId", "prod_category"],
    });

    if (!category) {
      return h
        .response({ error: `Category '${payload.categoryId}' not found` })
        .code(400);
    }

    const newUser = await productServices.createProduct({
      p_name: payload.p_name,
      p_description: payload.p_description,
      categoryId: category.categoryId,
      price: payload.price,
      qty: payload.qty
    });

    return h
      .response({
        message: "Inserted successfully!",
        productID: newUser.productId,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
