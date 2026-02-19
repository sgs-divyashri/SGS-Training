import {
  Category,
  CategoryPayload,
} from "../models/prodCategoryTableDefinition";
import generateCategoryId from "../services/generateCategoryId";

export const productCategoryRepository = {
  addProdCategory: async (
    payload: Pick<CategoryPayload, "prod_category">,
  ): Promise<Category> => {
    const category = await Category.create({
      ...payload,
      categoryId: generateCategoryId(),
    });
    return category;
  },

  editProductCategory: async (
    id: string,
    payload: Pick<CategoryPayload, "prod_category">,
  ) => {
    const product = await Category.findOne({ where: { categoryId: id } });
    if (!product) return null;

    if (payload.prod_category !== undefined)
      product.set("prod_category", payload.prod_category);

    await product.save();
    return product.get();
  },

  getProductCategories: async () => {
    const { rows } = await Category.findAndCountAll({
      order: [["createdAt", "DESC"]],
    });

    return {items: rows,}
  },

  deleteProductCategory: async (id: string): Promise<string | undefined> => {
    const count = await Category.destroy({ where: { categoryId: id } });
    return count > 0 ? id : undefined;
  },
};
