import type { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";

export const getUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const allUsers: User[] = userServices.getAllUsers();
    return h.response({message: 'User added successfully', users: allUsers}).code(201);
}