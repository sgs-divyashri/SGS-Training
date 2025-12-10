import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices"
import { validateEmail } from "./emailValidation";
import { UserPayload } from "../../model/userTableDefinition";

export const registerUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<UserPayload, "name" | "email" | "password" | "age">;

    if (!payload.name || !payload.email || !payload.password || !payload.age) {
      return h.response({ error: "All fields are required" }).code(400);
    }

    const validEmail = validateEmail(payload.email)

    if (!validEmail) {
      return h.response({ error: "Invalid email format" }).code(400);
    }

    // Check if email already exists
    const existingUser = await userServices.findByEmail(validEmail);
    if (existingUser) {
      return h.response({ error: "Email already registered" }).code(409);
    }

    const newUser = await userServices.createUser({
      name: payload.name,
      email: validEmail,
      password: payload.password,
      age: payload.age
    });

    return h.response({
      message: "Inserted successfully!",
      user: newUser.userId
    }).code(201);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }
};

