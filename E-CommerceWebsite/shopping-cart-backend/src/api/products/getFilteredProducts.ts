import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { error } from "node:console";

type SortParam =
  | "createdDesc"
  | "priceAsc"
  | "priceDesc"
  | "nameAsc"
  | "nameDesc"
  | "relevance";

export const getFilteredProductsHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      orderedBy,
      inStock,
      sort = "createdDesc",
      page = "1",
      pageSize = "12",
      prod_category,
    } = request.query as Record<string, any>;

    const q_filter = typeof q === 'string' ? q.trim() : '';
    if (!q_filter)
      return h.response({ error: 'Quick Filter is required and cannot be empty.'}).code(400)

    // normalize
    const toNum = (v: any) =>
      v === undefined || v === null || String(v) === "" ? undefined : Number(v);
    const minPriceNum = toNum(minPrice);
    const maxPriceNum = toNum(maxPrice);
    const orderedByNum = toNum(orderedBy);

    if (minPrice !== undefined && minPriceNum === undefined)
      return h.response({ error: "Invalid minPrice" }).code(400);
    if (maxPrice !== undefined && maxPriceNum === undefined)
      return h.response({ error: "Invalid maxPrice" }).code(400);
    if (
      minPriceNum !== undefined &&
      maxPriceNum !== undefined &&
      minPriceNum > maxPriceNum
    )
      return h
        .response({ error: "minPrice cannot be greater than maxPrice" })
        .code(400);
    if (orderedBy !== undefined && orderedByNum === undefined)
      return h.response({ error: "Invalid orderedBy" }).code(400);

    const pageNum = toNum(String(page))
    const pageSizeNum = Math.min(
      100, parseInt(String(pageSize))
    );
  
    let inStockValue: "In Stock" | "Out of Stock" | undefined = undefined;
    if (typeof inStock !== "undefined") {
      inStockValue = ["1", "true", "yes"].includes(
        String(inStock).toLowerCase(),
      )
        ? "In Stock"
        : "Out of Stock";
    }

    let categories: string[] | undefined;
    if (Array.isArray(prod_category)) {
      categories = (prod_category as string[]).filter(Boolean).map(String);
    } else if (
      typeof prod_category === "string" &&
      prod_category.trim() !== ""
    ) {
      categories = prod_category
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const SORT_MAP: Record<string, SortParam> = {
      createddesc: "createdDesc",
      priceasc: "priceAsc",
      pricedesc: "priceDesc",
      nameasc: "nameAsc",
      namedesc: "nameDesc",
      relevance: "relevance",
    };

    function normalizeSort(v: any): SortParam {
      const key = String(v ?? "")
        .trim()
        .toLowerCase();
      if (!key) return "createdDesc";
      return SORT_MAP[key] ?? "createdDesc";
    }

    const sortNorm = normalizeSort(sort);

    const result = await productServices.searchProducts({
      q: q_filter,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      orderedBy: orderedByNum,
      inStock: inStockValue,
      sort: sortNorm,
      page: pageNum,
      pageSize: pageSizeNum,
      categories
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
