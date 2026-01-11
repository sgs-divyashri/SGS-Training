import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { normalizeEmail } from "../../services/emailValidation";
import { validateEmail } from "../../services/emailValidation";
import { UserPayload } from "../../models/userTableDefinition";
import { passwordServices } from "../../services/passwordServices";

export const registerUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<UserPayload, "name" | "email" | "password">;

    if (!payload.name || !payload.email || !payload.password) {
      return h.response({ error: "Bad Request" }).code(400);
    }
    const email = normalizeEmail(payload.email)

    if (!validateEmail(email)) {
      return h.response({ error: "Invalid email format" }).code(400);
    }

    // Check if email already exists
    const existingUser = await userServices.findByEmail(email);
    if (existingUser) {
      return h.response({ error: "Email already registered" }).code(409);
    }

    const policy = passwordServices.validatePasswordPolicy(payload.password);

    if (!policy.ok) {
      return h.response({ error: 'Weak password', reasons: policy.errors }).code(400);
    }

    const newUser = await userServices.createUser({
      name: payload.name,
      email: email,
      password: payload.password,
    });

    return h.response({
      message: "Inserted successfully!",
      userID: newUser.userId
    }).code(201);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};

