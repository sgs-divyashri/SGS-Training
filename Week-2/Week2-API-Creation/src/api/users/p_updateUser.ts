import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

import { User, userServices } from "../../services/userServices";


export const partialUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = parseInt(request.params.id);
    const payload = request.payload as Partial<User>;

    const result = userServices.partialUpdateUser(id, payload);
    
    if (!result) {
        return h.response({ error: "Task not found" }).code(404);
    }

    return h.response({
        message: "Task updated successfully",
        result
    }).code(200);
}