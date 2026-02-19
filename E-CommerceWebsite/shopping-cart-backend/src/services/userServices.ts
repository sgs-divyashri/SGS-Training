import { User } from "../models/userTableDefinition";
import { Model, Optional } from "sequelize";
import { userRepository } from "../repository/userRepo";
import { UserPayload } from "../models/userTableDefinition";

export const userServices = {
  findByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({ where: { email }, attributes: ["userId", "email"], });
  },

  createUser: async (payload: Pick<UserPayload, "name"|"email"|"password"|"role">): Promise<User> => {
    const newUser = await userRepository.createUser(payload)
    return newUser
  },

  loginUser: async (loginData: Pick<UserPayload, "email" | "password" | "role">): Promise<User | null> => {
    const user = await userRepository.loginUser(loginData)
    return user
  },

  refreshToken: async (userId: number) => {
    const rToken = await userRepository.refreshToken(userId)
    return rToken
  },

  forgotPassword: async (data: Pick<UserPayload, "email">): Promise<User | null> => {
    const user = await userRepository.forgotPassword(data)
    return user
  },
  
  updatePassword: async (userId: number, passwordHash: string) => {
    const user = await userRepository.updatePassword(userId, passwordHash);
    return user;
  },


//   getAllUsers: async (): Promise<User[]> => {
//     const users = await userRepository.getAllUsers()
//     return users
//   },

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

