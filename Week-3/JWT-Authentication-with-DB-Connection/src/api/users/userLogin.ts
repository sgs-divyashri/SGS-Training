import { Request, ResponseToolkit } from "@hapi/hapi";
import { UserPayload, userServices } from "../../services/userServices";
import { generateToken } from "../../auth/authentication";

export const loginUserHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as Pick<UserPayload, "email" | "password">;

    if (!payload.email || !payload.password) {
      return h.response({ error: "Email and password are required" }).code(400);
    }

    // Validate credentials
    const user = await userServices.loginUser(payload);

    if (!user) {
      return h.response({ error: "Invalid email or password" }).code(401);
    }

    console.log(user)
    // Generate a new token
    const token = generateToken({
      userId: user.getDataValue("userId"),
      email: user.getDataValue("email")
    });

    return h.response({
      message: "Login successful...",
      token,
      user
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }
};
