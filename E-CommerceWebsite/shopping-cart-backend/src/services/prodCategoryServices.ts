import { productCategoryRepository } from "../repository/prodCategoryRepo";
import { Category } from "../models/prodCategoryTableDefinition";
import { CategoryPayload } from "../types/categoryPayload";

export const productCategoryServices = {
  addProdCategory: async (payload: Pick<CategoryPayload, "prod_category">, adminId: number): Promise<Category> => {
    const category = await productCategoryRepository.addProdCategory(payload, adminId);
    return category;
  },

  editProductCategory: async (id: string, payload: Pick<CategoryPayload, "prod_category">, adminId: number) => {
    return await productCategoryRepository.editProductCategory(id, payload, adminId);
  },

  getProductCategories: async (isAdmin: boolean, userId: number) => {
    const categories = await productCategoryRepository.getProductCategories(isAdmin, userId);
    return categories;
  },

  deleteProductCategory: async (id: string, adminId: number): Promise<string | undefined> => {
    return await productCategoryRepository.deleteProductCategory(id, adminId);
  },
};
