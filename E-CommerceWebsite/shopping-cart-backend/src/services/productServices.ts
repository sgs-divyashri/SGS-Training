import { productRepository } from "../repository/productRepo";
import { Product } from "../models/productTableDefinition";
import { ProductPayload } from "../types/productPayload";

export const productServices = {
  createProduct: async (payload: Pick<ProductPayload, "p_name" | "p_description" | "categoryId" | "price" | "qty">, adminId: number): Promise<Product> => {
    const newUser = await productRepository.createProduct(payload, adminId)
    return newUser
  },

  getProducts: async (isAdmin: boolean, userId: number) => {
    const products = await productRepository.getProducts(isAdmin, userId)
    return products
  },

  editProduct: async (id: string, payload: Pick<Partial<ProductPayload>, "p_name" | "p_description" | "categoryId" | "price" | "qty">): Promise<ProductPayload | null> => {
    return await productRepository.editProduct(id, payload)
  },

  delAndResProduct: async (id: string): Promise<Product | null> => {
    const product = await productRepository.delAndResProduct(id)
    return product
  },

  deleteProduct: async (id: string): Promise<string | undefined> => {
    return await productRepository.deleteProduct(id)
  }
}

