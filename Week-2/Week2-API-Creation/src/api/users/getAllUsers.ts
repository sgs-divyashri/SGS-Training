import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";

export const getUserHandler = (h: ResponseToolkit): ResponseObject => {
    const allUsers: User[] = userServices.getAllUsers();
    return h.response({message: 'User added successfully', users: allUsers}).code(201);
    // return allUsers
}