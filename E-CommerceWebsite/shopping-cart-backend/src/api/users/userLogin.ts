import { Request, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "../../authentication/authentication";
import { UserPayload } from "../../types/userPayload";
import { RefreshToken } from "../../models/refreshTokenTableDefinition";
import Jwt from "@hapi/jwt";

export const loginUserHandler = async (
  request: Request,
  h: ResponseToolkit,
) => {
  try {
    const payload = request.payload as Pick<
      UserPayload,
      "email" | "password"
    >;

    if (!payload.email || !payload.password) {
      return h
        .response({ error: "Email and password are required" })
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

    let rtRecord = await RefreshToken.findOne({
      where: {
        userId: user.userId,
      },
    });

    let finalRefreshToken = refreshToken!;

    if (!rtRecord) {
      const rtArtifacts = Jwt.token.decode(refreshToken!);
      const expSec = rtArtifacts.decoded.payload.exp as number;

      rtRecord = await RefreshToken.create({
        token: refreshToken!,
        userId: user.userId,
        revokedAt: null,
        expiresAt: new Date(expSec * 1000),
      });


      finalRefreshToken = refreshToken!;
    } else {
      finalRefreshToken = rtRecord.getDataValue("token");
    }

    h.state("rt", finalRefreshToken!, {
      isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: true,
      isSameSite: "Lax",
      path: "/",
    });

    // if (!rtRecord) {
    //   await RefreshToken.destroy({ where: { token: rt } });
    //   return h.response({ error: "Refresh token expired" }).code(401);
    // }

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
