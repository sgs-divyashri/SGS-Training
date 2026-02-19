import { Request, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "../../authentication/auth";
import { UserPayload } from "../../models/userTableDefinition";

export const loginUserHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as Pick<UserPayload, "email" | "password">;

    if (!payload.email || !payload.password) {
      return h.response({ error: "Email and password are required" }).code(400);
    }

    const user = await userServices.loginUser(payload);

    if (!user) {
      return h.response({ error: "Invalid email or password" }).code(400);
    }

    const token = generateToken({
      userId: user.getDataValue("userId"),
      email: user.getDataValue("email"),
      role: user.getDataValue("role")
    });

    return h.response({
      message: "Login successful...",
      token
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};
