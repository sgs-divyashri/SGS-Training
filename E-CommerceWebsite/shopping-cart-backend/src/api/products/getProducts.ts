import type { Request, ResponseToolkit } from "@hapi/hapi";
import { Product } from "../../models/productTableDefinition";
import { JWTPayload } from "../../authentication/authentication";
import { productServices } from "../../services/productServices";

export const getProductsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { userId, role } = request.auth.credentials as Pick<JWTPayload, "userId" | "role">;
    const isAdmin = String(role ?? "").trim().toLowerCase() === "admin";

    const products = await productServices.getProducts(isAdmin, userId);

    return h.response({ products }).code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: "Failed to fetch products" }).code(500);
  }
};
