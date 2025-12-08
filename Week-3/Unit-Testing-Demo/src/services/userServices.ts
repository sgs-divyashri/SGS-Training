import { User } from "../model/userTableDefinition";
import { Model, Optional } from "sequelize";
import { userRepository } from "../repository/userRepo";
import { UserPayload } from "../model/userTableDefinition";

export const userServices = {
  findByEmail: async (email: string) => {
    return await User.findOne({ where: { email } });
  },

  createUser: async (payload: Pick<UserPayload, "name"|"email"|"password"|"age">) => {
    const newUser = await userRepository.createUser(payload)
    return newUser
  },


  loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<Model<any, any> | null> => {
    const user = await userRepository.loginUser(loginData)
    return user
  },

  getAllUsers: async (): Promise<Model<any, any>[]> => {
    const users = await userRepository.getAllUsers()
    return users
  },

  getSpecificUser: async (id: number): Promise<Model<any, any> | null> => {
    const user = await userRepository.getSpecificUser(id)
    return user
  },

  fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">) => {
    const user = await userRepository.fullUpdateUser(id, payload)
    return user
  },

  partialUpdateUser: async (id: number, payload: Partial<UserPayload>) => {
    const user = await userRepository.partialUpdateUser(id, payload)
    return user
  },

  softDeleteUser: async (id: number) => {
    const user = await userRepository.softDeleteUser(id)
    return user
  }
}

