// src/repositories/productRepository.ts
import { Op, OrderItem } from "sequelize";
import { Product, ProductPayload } from "../models/productTableDefinition";
import { User } from "../models/userTableDefinition";
import generateSimpleId from "../services/generateProductId";

export type ProductFilterSpec = {
  q?: string | undefined; // search term for p_name/p_description
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  orderedBy?: number | undefined;
  inStock?: string; // default to true in handler if you want
  sort?:
    | "relevance"
    | "priceAsc"
    | "priceDesc"
    | "nameAsc"
    | "nameDesc"
    | "createdDesc";
  page?: number | undefined; // 1-based
  pageSize?: number | undefined; // limit per page
  returnAll?: boolean; // bypass pagination for admin/testing
  // optional: allow callers to override attributes
  attributes?: string[] | { exclude: string[] };
  categories?: string[] | undefined;
};

export const productRepository = {
  createProduct: async (
    payload: Pick<
      ProductPayload,
      "p_name" | "p_description" | "prod_category" | "orderedBy" | "price"
    >,
  ): Promise<Product> => {
    const userExists = await User.findOne({
      where: { userId: payload.orderedBy, isActive: true },
    });
    if (!userExists) {
      throw new Error("Invalid createdBy userId");
    }
    const newUser = await Product.create({
      ...payload,
      productId: generateSimpleId(),
    });
    return newUser;
  },

  getProducts: async () => {
    return Product.findAll({
      attributes: { exclude: ["createdBy"] },
      order: [["createdAt", "DESC"]],
    });
  },

  // Filtered search
  search: async (spec: ProductFilterSpec) => {
    const {
      q,
      minPrice,
      maxPrice,
      orderedBy,
      inStock,
      sort = "createdDesc",
      page = 1,
      pageSize = 12,
      returnAll = false,
      attributes,
      categories,
    } = spec;

    // Build WHERE
    const where: any = {};
    if (typeof inStock === "string") where.inStock = inStock;
    if (typeof orderedBy === "number") where.orderedBy = orderedBy;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price[Op.gte] = minPrice;
      if (maxPrice !== undefined) where.price[Op.lte] = maxPrice;
    }

    if (categories && categories.length > 0) {
      where.prod_category = { [Op.in]: categories };
    }

    // LIKE / ILIKE search on p_name & p_description
    let searchWhere: any | undefined;
    if (q && q.trim()) {
      const pattern = `%${escapeLike(q.trim())}%`;
      const likeOp = (Op as any).iLike ?? Op.like; // ILIKE for Postgres; LIKE otherwise
      searchWhere = {
        [Op.or]: [
          { p_name: { [likeOp]: pattern } },
          { p_description: { [likeOp]: pattern } },
        ],
      };
    }

    const finalWhere = searchWhere ? { [Op.and]: [where, searchWhere] } : where;

    // ORDER
    const order: OrderItem[] = mapSort(sort, Boolean(q));
    if (!order.length) order.push(["createdAt", "DESC"]); // safety default

    // Pagination
    const offset = returnAll
      ? undefined
      : (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const limit = returnAll ? undefined : Math.max(1, pageSize);

    // Query
    const { rows, count } = await Product.findAndCountAll({
      where: finalWhere,
      order,
      attributes: attributes ?? { exclude: ["createdBy"] },
      ...(typeof offset === "number" ? { offset } : {}),
      ...(typeof limit === "number" ? { limit } : {}),
    });

    const total = Array.isArray(count) ? count.length : (count as number);
    const pageOut = returnAll ? 1 : Math.max(1, page);
    const sizeOut = returnAll ? total : Math.max(1, pageSize);

    return {
      items: rows,
      total,
      page: pageOut,
      pageSize: sizeOut,
      totalPages: returnAll ? 1 : Math.ceil(total / sizeOut),
    };
  },

  delAndResProduct: async (id: string): Promise<Product | null> => {
    const product = await Product.findOne({ where: { productId: id } });
    if (!product) throw new Error(`User with ID ${id} not found`);

    const currentRaw =
      (product.get("inStock") as string | null) ?? "Out of Stock";
    const normalized = currentRaw.trim().toLowerCase();
    
    const nextInStock: "In Stock" | "Out of Stock" = normalized === 'in stock' ? 'Out of Stock' : 'In Stock';

    const [activeRows] = await Product.update(
      { inStock: nextInStock },
      { where: { productId: id } },
    );
    if (activeRows === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
    return await Product.findOne({ where: { productId: id } });
  },
};

// --- helpers ---
function mapSort(
  sort: ProductFilterSpec["sort"],
  hasSearch: boolean,
): OrderItem[] {
  switch (sort) {
    case "priceAsc":
      return [["price", "ASC"]];
    case "priceDesc":
      return [["price", "DESC"]];
    case "nameAsc":
      return [["p_name", "ASC"]];
    case "nameDesc":
      return [["p_name", "DESC"]];
    case "relevance":
      // keep simple; default order when searching (or add CASE literals for Postgres)
      return hasSearch ? [] : [["createdAt", "DESC"]];
    case "createdDesc":
    default:
      return [["createdAt", "DESC"]];
  }
}

function escapeLike(input: string) {
  // escape %, _, \ for LIKE
  return input.replace(/[\\%_]/g, (m) => `\\${m}`);
}
