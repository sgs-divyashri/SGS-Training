import { productCategoryRepository } from "../repository/prodCategoryRepo";
import {
  Category,
  CategoryPayload,
} from "../models/prodCategoryTableDefinition";
import { CartItemsPayload } from "../models/cartItemsTableDefinition";

export const productCategoryServices = {
  addProdCategory: async (
    payload: Pick<CategoryPayload, "prod_category">,
  ): Promise<Category> => {
    const category = await productCategoryRepository.addProdCategory(payload);
    return category;
  },

  editProductCategory: async (
    id: string,
    payload: Pick<CategoryPayload, "prod_category">,
  ) => {
    return await productCategoryRepository.editProductCategory(id, payload);
  },

  getProductCategories: async () => {
    const categories = await productCategoryRepository.getProductCategories();
    return categories;
  },

  deleteProductCategory: async (id: string): Promise<string | undefined> => {
    return await productCategoryRepository.deleteProductCategory(id);
  },
};
