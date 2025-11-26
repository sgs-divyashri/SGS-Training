import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "./authentication";


export const softDeleteUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = parseInt(request.params.id);
    const user = userServices.softDeleteUser(id);
    if (user===null) {
        return h.response({ error: 'User not found' }).code(404);
    }
    // Generate JWT token for this specific user
      const token = generateToken({
        userId: user.id!,
        email: user.email,
      });
    return h.response({ message: "User deleted successfully", token, user: user.id, active: user.isActive }).code(200);
}