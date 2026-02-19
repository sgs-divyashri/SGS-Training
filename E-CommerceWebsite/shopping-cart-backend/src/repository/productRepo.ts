import { Op, OrderItem } from "sequelize";
import { Product, ProductPayload } from "../models/productTableDefinition";
import generateSimpleId from "../services/generateProductId";
import { Category } from "../models/prodCategoryTableDefinition";
import generateCategoryId from "../services/generateCategoryId";

export type ProductFilterSpec = {
  q: string;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  orderedBy?: number | undefined;
  inStock?: string | undefined;
  sort?:
    | "relevance"
    | "priceAsc"
    | "priceDesc"
    | "nameAsc"
    | "nameDesc"
    | "createdDesc";
  page?: number | undefined;
  pageSize?: number | undefined;
  categories?: string[] | undefined;
};

export type PageSpec = {
  page?: number | undefined;
  pageSize?: number | undefined;
};

export const productRepository = {
  createProduct: async (
    payload: Pick<
      ProductPayload,
      "p_name" | "p_description" | "categoryId" | "price" | "qty"
    >,
  ): Promise<Product> => {
    const newUser = await Product.create({
      ...payload,
      productId: generateSimpleId(),
    });
    return newUser;
  },

  getProducts: async (spec: PageSpec) => {
    const { page = 1, pageSize = 12 } = spec;
    const offset = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const limit = Math.max(1, pageSize);
    const { rows, count } = await Product.findAndCountAll({
      attributes: { exclude: ["createdBy"] },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["prod_category"],
        },
      ],
      offset,
      limit,
    });

    const products = rows.map((p: any) => ({
      productId: p.productId,
      p_name: p.p_name,
      p_description: p.p_description,
      price: Number(p.price),
      qty: Number(p.qty),
      inStock: p.inStock,
      isNotification: !!p.isNotification,
      categoryId: p.categoryId,
      prod_category: p.category?.prod_category ?? "",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    const total = count;
    const pageOut = Math.max(1, page);
    const sizeOut = Math.max(1, pageSize);

    return {
      items: products,
      total,
      page: pageOut,
      pageSize: sizeOut,
      totalPages: Math.ceil(total / sizeOut),
    };
  },

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
      categories,
    } = spec;

    if (typeof q !== "string" || q.trim() === "") {
      throw new Error("Quick filter is required and cannot be empty.");
    }

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

    let searchWhere: any | undefined;
    if (q && q.trim()) {
      const pattern = `%${escapeLike(q.trim())}%`;
      const likeOp = (Op as any).iLike;
      searchWhere = {
        [Op.or]: [
          { p_name: { [likeOp]: pattern } },
          { p_description: { [likeOp]: pattern } },
        ],
      };
    }

    const finalWhere = searchWhere ? { [Op.and]: [where, searchWhere] } : where;

    const order: OrderItem[] = mapSort(sort, Boolean(q));
    if (!order.length) order.push(["createdAt", "DESC"]);

    const offset = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const limit = Math.max(1, pageSize);

    const { rows, count } = await Product.findAndCountAll({
      attributes: { exclude: ["createdBy"] },
      where: finalWhere,
      order,
      offset,
      limit,
    });

    const total = count;
    const pageOut = Math.max(1, page);
    const sizeOut = Math.max(1, pageSize);

    return {
      items: rows,
      total,
      page: pageOut,
      pageSize: sizeOut,
      totalPages: Math.ceil(total / sizeOut),
    };
  },

  editProduct: async (
    id: string,
    payload: Pick<
      Partial<Product>,
      "p_name" | "p_description" | "categoryId" | "price" | "qty"
    >,
  ): Promise<ProductPayload | null> => {
    const product = await Product.findOne({ where: { productId: id } });
    if (!product) return null;

    // const category = await Category.findOne({
    //   where: { prod_category: payload.categoryId },
    // });

    if (payload.p_name !== undefined) product.set("p_name", payload.p_name);
    if (payload.p_description !== undefined)
      product.set("p_description", payload.p_description);
    if (payload.categoryId !== undefined) {
      const category = await Category.findOne({
        where: {
          [Op.or]: [
            { categoryId: payload.categoryId as any }, 
            { prod_category: String(payload.categoryId) }, 
          ],
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }
      product.set("categoryId", category!.categoryId);
    }
    if (payload.price !== undefined) product.set("price", payload.price);
    if (payload.qty !== undefined) product.set("qty", payload.qty)

    await product.save();
    return product.get();
  },

  notifyProduct: async (id: string): Promise<Product | null> => {
    const product = await Product.findOne({ where: { productId: id } });
    if (!product) throw new Error(`Product with ID ${id} not found`);
    const nextIsNotify = !Boolean(product.isNotification);

    const [activeRows] = await Product.update(
      { isNotification: nextIsNotify },
      { where: { productId: id } },
    );
    if (activeRows === 0) {
      throw new Error(`User with ID ${id} not found or already deleted`);
    }
    return await Product.findOne({ where: { productId: id } });
  },

  delAndResProduct: async (id: string): Promise<Product | null> => {
    const product = await Product.findOne({ where: { productId: id } });
    if (!product) throw new Error(`Product with ID ${id} not found`);

    const currentRaw =
      (product.get("inStock") as string | null) ?? "Out of Stock";

    const nextInStock = currentRaw === "In Stock" ? "Out of Stock" : "In Stock";

    const notification = nextInStock === "In Stock";

    const [activeRows] = await Product.update(
      { inStock: nextInStock, isNotification: notification },
      { where: { productId: id, inStock: currentRaw } },
    );
    if (activeRows === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
    return await Product.findOne({ where: { productId: id } });
  },

  deleteProduct: async (id: string): Promise<string | undefined> => {
    const count = await Product.destroy({ where: { productId: id } });
    return count > 0 ? id : undefined;
  },
};

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
      return hasSearch ? [] : [["createdAt", "DESC"]];
    case "createdDesc":
    default:
      return [["createdAt", "DESC"]];
  }
}

function escapeLike(input: string) {
  return input.replace(/[\\%_]/g, (m) => `\\${m}`);
}
