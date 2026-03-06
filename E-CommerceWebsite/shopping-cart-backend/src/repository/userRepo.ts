import { User } from "../models/userTableDefinition";
import { passwordServices } from "../services/passwordServices";
import { UserPayload } from "../types/userPayload";
import Jwt from "@hapi/jwt";
import { RefreshToken } from "../models/refreshTokenTableDefinition";
import { JWT_SECRET } from "../config/constants";
import { JWTPayload } from "../authentication/authentication";
import { Op } from "sequelize";

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
      where: { email: loginData.email },
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

  refreshToken: async (rt?: string) => {
    if (!rt) {
      throw new Error("Refresh token missing");
    }

    let artifacts: ReturnType<typeof Jwt.token.decode>;
    try {
      artifacts = Jwt.token.decode(rt);
    } catch {
      throw new Error("Refresh token malformed");
    }

    const payload = artifacts.decoded.payload as JWTPayload;

    if (payload.type !== "refresh") {
      throw new Error("Not a refresh token");
    }

    try {
      Jwt.token.verify(artifacts, {
        key: JWT_SECRET,
        algorithm: "HS256",
        // You can keep/align aud/iss checks if you want strictness:
        // audience: "urn:audience:test",
        // issuer: "urn:issuer:test",
      });
    } catch (e: any) {
      throw new Error("Refresh token invalid or expired");
    }

    if (payload.aud !== "urn:audience:test" || payload.iss !== "urn:issuer:test") {
      throw new Error("Refresh token audience/issuer mismatch");
    }

    const dbRecord = await RefreshToken.findOne({
      where: {
        token: rt,
        revokedAt: { [Op.is]: null },
        // Optional: double-check expiresAt (though JWT verify already covers exp)
      },
    });

    if (!dbRecord) {
      throw new Error("Refresh token not found or revoked");
    }

    return { payload, rtRecord: dbRecord };

  },

  forgotPassword: async (data: Pick<UserPayload, "email">): Promise<User | null> => {
    const user = await User.findOne({
      where: { email: data.email },
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
