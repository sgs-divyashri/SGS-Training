import { User } from "../models/userTableDefinition";
import { Model, Optional } from "sequelize";
import { userRepository } from "../repository/userRepo";
import { UserPayload } from "../models/userTableDefinition";

export const userServices = {
  findByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({ where: { email } });
  },

  createUser: async (payload: Pick<UserPayload, "name"|"email"|"password"|"age">): Promise<User> => {
    const newUser = await userRepository.createUser(payload)
    return newUser
  },


  loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
    const user = await userRepository.loginUser(loginData)
    return user
  },

  getAllUsers: async (): Promise<User[]> => {
    const users = await userRepository.getAllUsers()
    return users
  },

  getSpecificUser: async (id: number): Promise<User | null> => {
    const user = await userRepository.getSpecificUser(id)
    return user
  },

  fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User | null | undefined> => {
    const user = await userRepository.fullUpdateUser(id, payload)
    return user
  },

  partialUpdateUser: async (id: number, payload: Partial<UserPayload>): Promise<UserPayload | null> => {
    const user = await userRepository.partialUpdateUser(id, payload)
    return user
  },

  softDeleteUser: async (id: number): Promise<number> => {
    const user = await userRepository.softDeleteUser(id)
    return user
  }
}

