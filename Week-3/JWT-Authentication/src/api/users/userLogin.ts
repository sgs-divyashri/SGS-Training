import { Request, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";
import { generateToken } from "./authentication";

export const loginUserHandler = (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as Pick<User, "email" | "password">;

    if (!payload.email || !payload.password) {
      return h.response({ error: "Email and password are required" }).code(400);
    }

    // Validate credentials
    const user = userServices.loginUser(payload);

    if (!user) {
      return h.response({ error: "Invalid email or password" }).code(401);
    }

    // Generate a new token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return h.response({
      message: "Login successful...",
      token
    }).code(200);

  } catch (err) {
    console.error("Error in login handler:", err);
    return h.response({ error: "Server error" }).code(500);
  }
};
