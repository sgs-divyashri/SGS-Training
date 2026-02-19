import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../../config/constants";
import { JWT_SECRET } from "../../config/constants";
import { userServices } from "../../services/userServices";

export async function resetPasswordHandler(request: Request, h: ResponseToolkit) {
  try {
    const authHeader = request.headers['authorization'] as string | undefined;
    const bearerPrefix = 'Bearer ';
    const tokenFromHeader =
      authHeader && authHeader.startsWith(bearerPrefix)
        ? authHeader.slice(bearerPrefix.length).trim()
        : undefined;

    const { password } = request.payload as { password: string };

    const token = tokenFromHeader;

    if (!token || !password) {
      return h.response({ error: "Token and Password are required" }).code(400);
    }

    const artifacts = Jwt.token.decode(token);
    Jwt.token.verify(artifacts, { key: JWT_SECRET, algorithm: 'HS256' });

    const claims = artifacts.decoded.payload as {
      userId: number;
      email?: string;
      purpose?: "password_reset" | "auth";
      aud?: string;
      iss?: string;
      iat?: number;
      exp?: number;
    };

    if (claims.purpose !== "password_reset") {
      return h.response({ error: "Invalid token purpose" }).code(403);
    }
    if (claims.aud !== "urn:audience:test" || claims.iss !== "urn:issuer:test") {
      return h.response({ error: "Invalid token audience/issuer" }).code(401);
    }

    const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await userServices.updatePassword(claims.userId, hash);

    return h.response({ message: "Password updated successfully." }).code(200);
  } catch (err: any) {
    console.error("ERROR:", err);
    return h.response({ error: err.message || "Internal server error" }).code(500);
  }
}