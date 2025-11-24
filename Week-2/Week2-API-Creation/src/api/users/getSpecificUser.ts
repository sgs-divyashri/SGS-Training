import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";

export const getSpecificUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = parseInt(request.params.id);
    const user = userServices.getSpecificUser(id);
    if (!user) {
      return h.response({ error: 'User not found' }).code(404);
    }
    return h.response({message: 'User added successfully', user}).code(200);
}