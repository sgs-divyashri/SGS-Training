import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { JWTPayload } from "../../authentication/authentication";
import { productCategoryServices } from "../../services/prodCategoryServices";

export const getCategoryHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const { userId, role } = request.auth.credentials as Pick<JWTPayload, "userId" | "role">;
    const isAdmin = String(role ?? "").trim().toLowerCase() === "admin";

    const result = await productCategoryServices.getProductCategories(isAdmin, userId);

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
