import { User } from "../models/userTableDefinition";
import { Model, Optional } from "sequelize";
import { productRepository } from "../repository/productRepo";
import { UserPayload } from "../models/userTableDefinition";
import { Product, ProductPayload } from "../models/productTableDefinition";

export const productServices = {
  createProduct: async (payload: Pick<ProductPayload, "p_name" | "p_description" | "orderedBy" | "price">): Promise<Product> => {
    const newUser = await productRepository.createProduct(payload)
    return newUser
  },

  getAllProducts: async (): Promise<Product[]> => {
    const users = await productRepository.getAllProducts()
    return users
  },

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

