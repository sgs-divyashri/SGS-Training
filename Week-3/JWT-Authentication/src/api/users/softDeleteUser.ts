import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "./authentication";
import { verifyToken } from "./authentication";

export const softDeleteUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  try {

    const id = Number(request.params.id);

    // Read Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const check = verifyToken(token);

    const task = userServices.softDeleteUser(id);
    if (task === null) {
      return h.response({ error: 'Task not found' }).code(404);
    }


    return h.response({
      message: "Retrieved Users successfully",
      token,
      task: task,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN fullUpdateTaskHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }

  // const id = parseInt(request.params.id);
  // const user = userServices.softDeleteUser(id);
  // if (user===null) {
  //     return h.response({ error: 'User not found' }).code(404);
  // }
  // // Generate JWT token for this specific user
  //   const token = generateToken({
  //     userId: user.id!,
  //     email: user.email,
  //   });
  // return h.response({ message: "User deleted successfully", token, user: user.id, active: user.isActive }).code(200);
}