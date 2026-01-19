// handlers/product/getProducts.ts
import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";

type SortParam =
  | "createdDesc"
  | "priceAsc"
  | "priceDesc"
  | "nameAsc"
  | "nameDesc"
  | "relevance";

export const getProductsHandler = async (
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
      all,
      prod_category,
    } = request.query as Record<string, any>;

    // normalize
    const toNum = (v: any) =>
      v === undefined || v === null || String(v) === "" ? undefined : Number(v);
    const minPriceNum = toNum(minPrice);
    const maxPriceNum = toNum(maxPrice);
    const orderedByNum = toNum(orderedBy);

    // basic validation
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

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const pageSizeNum = Math.min(
      100,
      Math.max(1, parseInt(String(pageSize), 10) || 12),
    );
    const returnAll = ["1", "true", "yes"].includes(
      String(all ?? "").toLowerCase(),
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
      // canonical spellings
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

    // delegate filtering/sorting/pagination to repo via service
    const result = await productServices.searchProducts({
      q: q ? String(q).trim() : undefined,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      orderedBy: orderedByNum,
      ...(inStockValue ? { inStock: inStockValue } : {}),
      sort: sortNorm,
      page: pageNum,
      pageSize: pageSizeNum,
      returnAll,
      attributes: { exclude: ["createdBy"] },
      ...(categories && categories.length ? { categories } : {}),
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
