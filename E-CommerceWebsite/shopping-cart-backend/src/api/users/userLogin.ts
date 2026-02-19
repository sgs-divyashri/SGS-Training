import { Request, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "../../authentication/authentication";
import { UserPayload } from "../../models/userTableDefinition";
import { RefreshToken } from "../../models/refreshTokenTableDefinition";
import Jwt from "@hapi/jwt";

export const loginUserHandler = async (
  request: Request,
  h: ResponseToolkit,
) => {
  try {
    const payload = request.payload as Pick<
      UserPayload,
      "email" | "password" | "role"
    >;

    if (!payload.email || !payload.password || !payload.role) {
      return h
        .response({ error: "Email, password and role are required" })
        .code(400);
    }

    const user = await userServices.loginUser(payload);

    if (!user) {
      return h
        .response({ error: "Invalid email or password or role" })
        .code(400);
    }

    const { accessToken, refreshToken } = generateToken({
      userId: user.getDataValue("userId"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role"),
      purpose: "auth",
    });

    const rtArtifacts = Jwt.token.decode(refreshToken!);
    const expSec = rtArtifacts.decoded.payload.exp as number;

    await RefreshToken.create({
      token: refreshToken!,
      userId: user.getDataValue("userId"),
      revokedAt: null,
      expiresAt: new Date(expSec * 1000),
    });

    h.state("rt", refreshToken!, {
      isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: true,
      isSameSite: "Lax",
      path: "/",
    });

    return h
      .response({
        message: "Login successful...",
        data: { accessToken },
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
