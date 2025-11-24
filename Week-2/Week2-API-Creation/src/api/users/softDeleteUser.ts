import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";


export const softDeleteUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = parseInt(request.params.id);
    const user = userServices.softDeleteUser(id);
    if (user===null) {
        return h.response({ error: 'User not found' }).code(404);
    }
    return h.response({ message: "User deleted successfully", user: user.id, active: user.isActive }).code(200);
}