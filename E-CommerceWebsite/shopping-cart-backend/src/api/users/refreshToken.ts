import { ResponseToolkit, Request } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import { JWT_SECRET } from "../../config/constants";
import { generateToken } from "../../authentication/authentication";
import { RefreshToken } from "../../models/refreshTokenTableDefinition";
import { userServices } from "../../services/userServices";
import { User } from "../../models/userTableDefinition";

export const refreshTokenHandler = async (
  request: Request,
  h: ResponseToolkit,
) => {
  const rt = request.state?.rt as string | undefined;

  if (!rt) {
    return h.response({ message: "Refresh token required" }).code(401);
  }

  try {
    const artifacts = Jwt.token.decode(rt);
    Jwt.token.verify(artifacts, { key: JWT_SECRET, algorithm: "HS256" });
    const payload = artifacts.decoded.payload as any;

    if (payload.type !== "refresh") {
      return h.response({ message: "Invalid token type" }).code(401);
    }

    const stored = await RefreshToken.findOne({
      where: { token: rt, revokedAt: null },
    });
    if (!stored)
      return h.response({ error: "Refresh token revoked" }).code(401);

    const user = await User.findByPk(payload.userId);
    if (!user || user.isActive === false)
      return h.response({ error: "User not found/disabled" }).code(401);

    const row = await RefreshToken.findByPk(rt);
    if (!row) return h.response({ message: "Unknown refresh token" }).code(401);
    if (row.expiresAt.getTime() <= Date.now()) {
      return h.response({ message: "Refresh token expired" }).code(401);
    }

    const rToken = await userServices.refreshToken(payload.userId);
    if (!rToken) {
      return h
        .response({ error: "Error in deleting Refresh token." })
        .code(400);
    }

    const userPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      purpose: payload.purpose,
    };

    const { accessToken, refreshToken: newRt } = generateToken(userPayload);

    await row.update({ revokedAt: new Date() });

    const newArtifacts = Jwt.token.decode(newRt!);
    const newExpSec = newArtifacts.decoded.payload.exp as number;

    await RefreshToken.create({
      token: newRt!,
      userId: payload.userId,
      revokedAt: null,
      expiresAt: new Date(newExpSec * 1000),
    });

    h.state("rt", newRt!, {
      isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: true,
      isSameSite: "Lax",
      path: "/",
    });

    return h.response({ data: { accessToken } }).code(200);
  } catch (err) {
    return h
      .response({ message: "Invalid or expired refresh token" })
      .code(401);
  }
};
