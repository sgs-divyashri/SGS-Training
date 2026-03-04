import { Category } from "../models/prodCategoryTableDefinition";
import { CategoryPayload } from "../types/categoryPayload";
import generateCategoryId from "../services/generateCategoryId";

export const productCategoryRepository = {
  addProdCategory: async (payload: Pick<CategoryPayload, "prod_category">, adminId: number): Promise<Category> => {
    const category = await Category.create({
      ...payload,
      categoryId: generateCategoryId(),
      addedBy: adminId
    });
    return category;
  },

  editProductCategory: async (id: string, payload: Pick<CategoryPayload, "prod_category">, adminId: number) => {
    const category = await Category.findOne({ where: { categoryId: id, addedBy: adminId } });
    if (!category) return null;

    if (payload.prod_category !== undefined)
      category.set("prod_category", payload.prod_category);

    await category.save();
    return category.get();
  },

  getProductCategories: async (isAdmin: boolean, userId: number) => {
    const where = isAdmin ? { addedBy: userId } : {};

    const { rows } = await Category.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return {items: rows,}
  },

  deleteProductCategory: async (id: string, adminId: number): Promise<string | undefined> => {
    const count = await Category.destroy({ where: { categoryId: id, addedBy: adminId } });
    return count > 0 ? id : undefined;
  },
};
