import { verifyToken } from "./authentication";
import { ResponseToolkit, ResponseObject, Request } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../services/userServices";

export const getUserHandler = (request: Request,h: ResponseToolkit): ResponseObject => {
  try {
    // // Read Authorization header
    // const authHeader = request.headers.authorization;

    // if (!authHeader) {
    //   return h.response({ error: "Unauthorized" }).code(401);
    // }

    // // Extract token
    // const token = authHeader.replace("Bearer ", "");

    // // Verify token
    // const payload = verifyToken(token);

    const allUsers: User[] = userServices.getAllUsers();

    return h.response({
      message: "Retrieved All Users successfully",
      users: allUsers,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN getUserHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }
};


