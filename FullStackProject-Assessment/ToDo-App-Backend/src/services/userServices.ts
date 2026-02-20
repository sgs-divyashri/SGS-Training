import { User, UserPayload } from "../models/userTableDefinition";
import { userRepository } from "../repository/userRepository";

export const userServices = {
  findByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({
      where: { email },
      attributes: ["userId", "email"],
    });
  },

  createUser: async (
    payload: Pick<UserPayload, "name" | "email" | "password" | "role">,
  ): Promise<User> => {
    const newUser = await userRepository.createUser(payload);
    return newUser;
  },

  loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
    const user = await userRepository.loginUser(loginData)
    return user
  },

  getAllUsers: async (): Promise<User[]> => {
    const users = await userRepository.getAllUsers()
    return users
  },

  deleteUser: async (id: string): Promise<string | undefined> => {
    return await userRepository.deleteUser(id);
  },
};
