import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../services/userServices";

export const fullUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = Number(request.params.id);
    const payload = request.payload as User;

    const result = userServices.fullUpdateUser(id, payload);
    
    if (result === null) {
      return h.response({ error: "User not found" }).code(404);
    }

    if (result === "MISSING_FIELDS") {
      return h.response({ error: "All fields are required for full update" }).code(400);
    }

    return h.response({message: "Task fully updated", result}).code(200);
}