import { ResponseToolkit, Request } from "@hapi/hapi";
import { generateToken } from "../../authentication/authentication";
import { userServices } from "../../services/userServices";
import { JWTPayload } from "../../authentication/authentication";

export const refreshTokenHandler = async (
  request: Request,
  h: ResponseToolkit,
) => {
  const rt = request.state?.rt as string | undefined;

  if (!rt) {
    return h.response({ message: "Refresh token required" }).code(401);
  }

  try {
    const { payload } = await userServices.refreshToken(rt);

    const basePayload: Pick<JWTPayload, "userId" | "email" | "role" | "purpose"> = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      purpose: payload.purpose,
    };

    const { accessToken } = generateToken(basePayload, {
      accessOnly: true,
      expiresIn: 900, 
    });

    h.state("rt", rt!, {
      isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: true,
      isSameSite: "Lax",
      path: "/",
    });

    return h.response({ message: "Access token refreshed", data: { accessToken } }).code(200);

  } catch (err) {
    return h
      .response({ message: "Invalid or expired refresh token" })
      .code(401);
  }
};
