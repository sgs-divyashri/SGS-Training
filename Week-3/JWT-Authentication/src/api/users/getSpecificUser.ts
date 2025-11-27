import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "./authentication";
import { verifyToken } from "./authentication";

export const getSpecificUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  try {
    // // Authenticate user
    // const authHeader = request.headers.authorization;
    // if (!authHeader) {
    //   return h.response({ error: "Missing Authorization Header" }).code(401);
    // }

    // const token = authHeader.replace("Bearer ", "");
    // const user = verifyToken(token);   // <-- VERIFY TOKEN HERE

    // After verification, fetch the task
    const id = Number(request.params.id);
    const specificUser = userServices.getSpecificUser(id);


    if (!specificUser) {
      return h.response({ error: "User not found" }).code(404);
    }

    // Return the task (NO NEW TOKEN)
    return h
      .response({
        message: `User ID ${id} retrieved successfully`,
        user: specificUser
      })
      .code(200);

  } catch (err) {
    return h.response({ error: "Invalid or expired token" }).code(401);
  }

}