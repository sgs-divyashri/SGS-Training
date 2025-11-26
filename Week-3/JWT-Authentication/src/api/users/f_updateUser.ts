import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../services/userServices";
import { generateToken } from "./authentication";

export const fullUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  const id = Number(request.params.id);
  const payload = request.payload as Pick<User, "name"|"email"|"password"|"age">;

  const result = userServices.fullUpdateUser(id, payload);

  if (result === null) {
    return h.response({ error: "User not found" }).code(404);
  }

  if (typeof result === "string") {
    return h.response({ error: "All fields are required for full update" }).code(400);
  }

  // Generate JWT token for this specific user
  const token = generateToken({
    userId: result.id!,
    email: result.email,
  });
  return h.response({ message: "Task fully updated", token, result }).code(200);
}