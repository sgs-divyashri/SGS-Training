import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { UserPayload } from "../../models/userTableDefinition";
import { passwordServices } from "../../services/passwordServices";
import { validateEmail } from "../../services/emailValidation";

export const createUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }
    const payload = request.payload as Pick<UserPayload, "name" | "email" | "password" | "role">;

    if (!payload.name || !payload.email || !payload.password || !payload.role) {
      return h.response({ error: "Bad Request" }).code(400);
    }

    const validEmail = validateEmail(payload.email)

    if (!validEmail) {
      return h.response({ error: "Invalid email format" }).code(400);
    }

    const existingUser = await userServices.findByEmail(validEmail);
    if (existingUser) {
      return h.response({ error: "Email already registered" }).code(409);
    }

    const policy = passwordServices.validatePasswordPolicy(payload.password);

    if (!policy.ok) {
      return h.response({ error: 'Weak password', reasons: policy.errors }).code(400);
    }

    const newUser = await userServices.createUser({
      name: payload.name,
      email: validEmail,
      password: payload.password,
      role: payload.role
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

