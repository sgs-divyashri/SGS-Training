import { Op, OrderItem } from "sequelize";
import { Product, ProductPayload } from "../models/productTableDefinition";
import generateSimpleId from "../services/generateProductId";
import { Category } from "../models/prodCategoryTableDefinition";
import Sequelize from "sequelize";

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
      "p_name" | "p_description" | "categoryId" | "price" | "qty" | "addedBy"
    >,
  ): Promise<Product> => {
    console.log('[createProduct] data.addedBy =', payload.addedBy);
    const newUser = await Product.create({
      ...payload,
      productId: generateSimpleId(),
    });
    return newUser;
  },

  getProducts: async (isAdmin: boolean, userId: number) => {
    const where = isAdmin ? { addedBy: userId } : {};

    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category, as: 'category', attributes: [] }],
      attributes: {
        include: [[Sequelize.col('category.prod_category'), 'prod_category']],
      },
    });

    return products
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

  delAndResProduct: async (id: string): Promise<Product | null> => {
    const product = await Product.findOne({ where: { productId: id } });
    if (!product) throw new Error(`Product with ID ${id} not found`);

    const currentRaw =
      (product.get("inStock") as string | null) ?? "Out of Stock";

    const nextInStock = currentRaw === "In Stock" ? "Out of Stock" : "In Stock";

    const notification = nextInStock === "In Stock";

    const [activeRows] = await Product.update(
      { inStock: nextInStock },
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
