import { productRepository, ProductFilterSpec, PageSpec } from "../repository/productRepo";
import { Product, ProductPayload } from "../models/productTableDefinition";
import { Category } from "../models/prodCategoryTableDefinition";

export const productServices = {
  createProduct: async (payload: Pick<ProductPayload, "p_name" | "p_description" | "categoryId" | "price" | "qty">): Promise<Product> => {
    const newUser = await productRepository.createProduct(payload)
    return newUser
  },

  getProducts: async (spec: PageSpec) => {
    const products = await productRepository.getProducts(spec)
    return products
  },

  searchProducts: async (spec: ProductFilterSpec) => {
    return await productRepository.search(spec)
  },

  editProduct: async (id: string, payload: Pick<Partial<Product>, "p_name" | "p_description" | "categoryId" | "price" | "qty">): Promise<ProductPayload | null> => {
    return await productRepository.editProduct(id, payload)
  },

  notifyProduct: async (id: string): Promise<Product | null> => {
    const notify = await productRepository.notifyProduct(id)
    return notify
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

