import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { ProductPayload } from "../../models/productTableDefinition";
import {
  Category,
  CategoryPayload,
} from "../../models/prodCategoryTableDefinition";
import { productCategoryServices } from "../../services/prodCategoryServices";
import { Op } from "sequelize";

export const addProductCategoryHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }
    
    const payload = request.payload as Pick<CategoryPayload, "prod_category">;
    if (!payload.prod_category) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const existing = await Category.findOne({
      where: { prod_category: { [Op.iLike]: payload.prod_category } },
      attributes: ["categoryId", "prod_category"],
    });
    if (existing) {
      return h
        .response({
          error: `Category '${payload.prod_category}' already exists`,
          categoryId: existing.categoryId,
        })
        .code(409);
    }

    const newCategory = await productCategoryServices.addProdCategory({
      prod_category: payload.prod_category,
    });

    return h
      .response({
        message: "Category Inserted successfully!",
        categoryID: newCategory.categoryId,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
