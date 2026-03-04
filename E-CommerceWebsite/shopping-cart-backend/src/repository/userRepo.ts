import { User } from "../models/userTableDefinition";
import { passwordServices } from "../services/passwordServices";
import { UserPayload } from "../types/userPayload";

export const userRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({ where: { email }, attributes: ["userId", "email"], });
  },
  
  createUser: async (payload: Pick<UserPayload, "name" | "email" | "password" | "role">): Promise<User> => {
    const newUser = await User.create({
      ...payload,
      password: passwordServices.hashPassword(payload.password),
    });
    return newUser;
  },

  loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
    const user = await User.findOne({
      where: { email: loginData.email},
      attributes: { include: ["password"] },
    });
    if (!user) return null;

    const hashedPassword: string = user.password;

    const isValidPassword = passwordServices.verifyPassword(
      loginData.password,
      hashedPassword,
    );
    if (!isValidPassword) return null;

    return user;
  },

  forgotPassword: async (data: Pick<UserPayload, "email">): Promise<User | null> => {
    const user = await User.findOne({
      where: { email: data.email},
    });
    if (!user) return null;

    return user;
  },

  updatePassword: async (userId: number, passwordHash: string) => {
    const user = await User.update(
      { password: passwordHash },
      { where: { userId } },
    );
    return user;
  }
};
