import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { validateEmail } from "../../services/emailValidation";
import { UserPayload } from "../../models/userTableDefinition";
import { passwordServices } from "../../services/passwordServices";
import { sendMail } from "../../services/resetPasswordMailer";

export const registerUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<UserPayload, "name" | "email" | "password" | "role">;

    if (!payload.name || !payload.email || !payload.password || !payload.role) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    if (!validateEmail(payload.email)) {
      return h.response({ error: "Invalid email format" }).code(400);
    }

    const existingUser = await userServices.findByEmail(payload.email);
    if (existingUser) {
      return h.response({ error: "Email already registered" }).code(409);
    }

    const policy = passwordServices.validatePasswordPolicy(payload.password);

    if (!policy.ok) {
      return h.response({ error: 'Weak password', reasons: policy.errors }).code(400);
    }

    const newUser = await userServices.createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role
    });

    return h.response({
      message: "Inserted successfully!",
      userID: newUser.userId
    }).code(201);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error"}).code(500);
  }
};

