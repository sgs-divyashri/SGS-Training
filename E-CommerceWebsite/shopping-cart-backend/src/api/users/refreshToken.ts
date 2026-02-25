import { ResponseToolkit, Request } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import { JWT_SECRET } from "../../config/constants";
import { generateToken } from "../../authentication/authentication";
import { RefreshToken } from "../../models/refreshTokenTableDefinition";
import { Op } from "sequelize";

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

    const rtRecord = await RefreshToken.findOne({
      where: {
        token: rt,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!rtRecord) {
      return h.response({ error: "Refresh token expired or invalid" }).code(401);
    }

    const { accessToken } = generateToken(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        purpose: "auth",
      },
      { accessOnly: true, expiresIn: 900 } 
    );

    return h.response({ data: { accessToken } }).code(200);
  } catch (err) {
    return h
      .response({ message: "Invalid or expired refresh token" })
      .code(401);
  }
};
