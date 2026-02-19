import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";

export const getAllProductsHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const { page = "1", pageSize = "12" } = request.params as Record<
      string,
      any
    >;
    const toNum = (v: any) =>
      v === undefined || v === null || String(v) === "" ? undefined : Number(v);
    const pageNum = toNum(String(page));
    const pageSizeNum = Math.min(100, parseInt(String(pageSize)));
    const result = await productServices.getProducts({
      page: pageNum,
      pageSize: pageSizeNum,
    });

    return h
      .response({
        message: "Retrieved products successfully",
        products: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        },
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
