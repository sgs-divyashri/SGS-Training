import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";
import { AuthResponse } from "../../services/userServices";
import { generateToken } from "./authentication";

export const getUserHandler = (request: Request,h: ResponseToolkit): ResponseObject => {
  try {
    const allUsers: User[] = userServices.getAllUsers();

    const users = allUsers.map(u => {

      const token = generateToken({
        userId: u.id!,
        email: u.email,
      });

      return { ...u, token };
    });

    return h.response({
      message: "Retrieved Users successfully",
      users,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN getUserHandler:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

