import { User } from "../models/userTableDefinition";
import { userRepository } from "../repository/userRepo";
import { UserPayload } from "../types/userPayload";
import { RefreshToken } from "../models/refreshTokenTableDefinition";
import { JWT_SECRET } from "../config/constants";
import { JWTPayload } from "../authentication/authentication";
import Jwt from "@hapi/jwt";
import { Op } from "sequelize";

export const userServices = {
  findByEmail: async (email: string): Promise<User | null> => {
    return await userRepository.findByEmail(email);
  },

  refreshToken: async (rt?: string): Promise<{
    payload: JWTPayload;
    rtRecord: RefreshToken;
  }> => {
    return await userRepository.refreshToken(rt)
  },

  createUser: async (payload: Pick<UserPayload, "name" | "email" | "password" | "role">): Promise<User> => {
    return await userRepository.createUser(payload);
  },

  loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
    return await userRepository.loginUser(loginData)
  },

  forgotPassword: async (data: Pick<UserPayload, "email">): Promise<User | null> => {
    return await userRepository.forgotPassword(data)
  },

  updatePassword: async (userId: number, passwordHash: string) => {
    return await userRepository.updatePassword(userId, passwordHash);
  }
}

