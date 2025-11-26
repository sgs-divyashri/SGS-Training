import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";
import { generateToken } from "./authentication";
import { verifyToken } from "./authentication";


export const partialUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  try {

    const id = Number(request.params.id);
    const payload = request.payload as User;
    // Read Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const check = verifyToken(token);

    const task = userServices.partialUpdateUser(id, payload);

    if (task === null) {
      return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
    }

    return h.response({
      message: "Retrieved Users successfully",
      token,
      task: task,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN partialUpdateTaskHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }

  // const id = parseInt(request.params.id);
  // const payload = request.payload as Pick<User, "name"|"email"|"password"|"age"> | Partial<User>;

  // const result = userServices.partialUpdateUser(id, payload);

  // if (!result) {
  //     return h.response({ error: "Task not found" }).code(404);
  // }

  // // Generate JWT token for this specific user
  //   const token = generateToken({
  //     userId: result.id!,
  //     email: result.email,
  //   });

  // return h.response({message: "Task updated successfully", token,result}).code(200);
}