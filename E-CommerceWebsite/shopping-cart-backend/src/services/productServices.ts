import { productRepository } from "../repository/productRepo";
import { Product } from "../models/productTableDefinition";
import { ProductPayload } from "../types/productPayload";

export const productServices = {
  createProduct: async (payload: Pick<ProductPayload, "p_name" | "p_description" | "categoryId" | "price" | "qty" | "addedBy">): Promise<Product> => {
    const newUser = await productRepository.createProduct(payload)
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

  // getAllProducts: async (): Promise<Product[]> => {
  //   const users = await productRepository.getAllProducts()
  //   return users
  // },

//   getSpecificUser: async (id: number): Promise<User | null> => {
//     const user = await userRepository.getSpecificUser(id)
//     return user
//   },

//   fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User | null | undefined> => {
//     const user = await userRepository.fullUpdateUser(id, payload)
//     return user
//   },

//   partialUpdateUser: async (id: number, payload: Partial<UserPayload>): Promise<UserPayload | null> => {
//     const user = await userRepository.partialUpdateUser(id, payload)
//     return user
//   },

//   toggleUser: async (id: number): Promise<User | null> => {
//     const user = await userRepository.toggleUser(id)
//     return user
//   },

//   // restoreUser: async (id: number): Promise<User | null> => {
//   //   const user = await userRepository.restoreUser(id)
//   //   return user
//   // }
}

