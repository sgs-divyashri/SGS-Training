import { User } from "../models/userTableDefinition";
import { userRepository } from "../repository/userRepo";
import { UserPayload } from "../models/userTableDefinition";

export const userServices = {
  findByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({ where: { email }, attributes: ["userId", "email"], });
  },

  createUser: async (payload: Pick<UserPayload, "name"|"email"|"password"|"age">): Promise<User> => {
    const newUser = await userRepository.createUser(payload)
    return newUser
  },

  loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
    const user = await userRepository.loginUser(loginData)
    return user
  }
}

