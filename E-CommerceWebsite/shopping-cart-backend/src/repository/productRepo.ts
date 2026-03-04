import { Op, OrderItem } from "sequelize";
import { Product } from "../models/productTableDefinition";
import { ProductPayload } from "../types/productPayload";
import generateSimpleId from "../services/generateProductId";
import { Category } from "../models/prodCategoryTableDefinition";
import Sequelize from "sequelize";

export const productRepository = {
  createProduct: async (payload: Pick<ProductPayload, "p_name" | "p_description" | "categoryId" | "price" | "total_quantity">, adminId: number): Promise<Product> => {
    const newUser = await Product.create({
      ...payload,
      productId: generateSimpleId(),
      addedBy: adminId
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

  editProduct: async (id: string, payload: Pick<Partial<Product>, "p_name" | "p_description" | "categoryId" | "price" | "total_quantity">, adminId: number): Promise<ProductPayload | null> => {
    const product = await Product.findOne({ where: { productId: id, addedBy: adminId } });
    if (!product) return null;

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
    if (payload.total_quantity !== undefined) product.set("total_quantity", payload.total_quantity)

    await product.save();
    return product.get();
  },

  delAndResProduct: async (id: string): Promise<Product | null> => {
    const product = await Product.findOne({ where: { productId: id } });
    if (!product) throw new Error(`Product with ID ${id} not found`);

    const currentRaw =
      (product.get("inStock") as string | null) ?? "Out of Stock";

    const nextInStock = currentRaw === "In Stock" ? "Out of Stock" : "In Stock";

    const [activeRows] = await Product.update(
      { inStock: nextInStock },
      { where: { productId: id, inStock: currentRaw } },
    );
    if (activeRows === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
    return await Product.findOne({ where: { productId: id } });
  },

  deleteProduct: async (id: string, adminId: number): Promise<string | undefined> => {
    const count = await Product.destroy({ where: { productId: id, addedBy: adminId } });
    return count > 0 ? id : undefined;
  },
};