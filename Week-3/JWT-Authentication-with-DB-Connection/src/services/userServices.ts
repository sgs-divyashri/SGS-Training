import { User } from "../api/users/userTableDefinition";
import { Model } from "sequelize";
import { userRepository } from "../repository/userRepo";

export interface UserPayload {
  id: number,
  name: string,
  email: string,
  password: string,
  age: number,
  createdAt: string,
  updatedAt: string,
  isActive: boolean,
  deletedAt?: string | null;
}

export const userServices = {
  findByEmail: async (email: string) => {
    return await User.findOne({ where: { email } });
  },

  createUser: async (payload: Partial<UserPayload>) => {
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

  // partialUpdateUser: (id: number, payload: Partial<User>): null | User => {
    // const user = users.find(t => t.id === id && t.isActive);
    // if (!user) {
    //   return null
    // }

    // // PARTIAL UPDATE (update only fields sent)
    // if (payload.name !== undefined) user.name = payload.name;
    // if (payload.email !== undefined) user.email = payload.email;
    // if (payload.password !== undefined) user.password = hashPassword(payload.password);
    // if (payload.age !== undefined) user.age = payload.age;

    // user.updatedAt = new Date().toLocaleString();

    // return user
  // },


  softDeleteUser: async (id: number) => {
    const user = await userRepository.softDeleteUser(id)
    return user
  }
}

