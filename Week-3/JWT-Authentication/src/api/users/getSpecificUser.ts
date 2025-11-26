import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "./authentication";

export const getSpecificUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  const id = parseInt(request.params.id);
  const user = userServices.getSpecificUser(id);

  if (!user) {
    return h.response({ error: 'User not found' }).code(404);
  }
  // Generate JWT token for this specific user
  const token = generateToken({
    userId: user.id!,
    email: user.email,
  });
  return h.response({ message: `Retrived User ID ${user.id}`, token, user }).code(200);
}