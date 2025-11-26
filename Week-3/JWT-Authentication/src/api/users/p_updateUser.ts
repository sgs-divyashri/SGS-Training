import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";
import { generateToken } from "./authentication";


export const partialUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = parseInt(request.params.id);
    const payload = request.payload as Pick<User, "name"|"email"|"password"|"age"> | Partial<User>;

    const result = userServices.partialUpdateUser(id, payload);
    
    if (!result) {
        return h.response({ error: "Task not found" }).code(404);
    }

    // Generate JWT token for this specific user
      const token = generateToken({
        userId: result.id!,
        email: result.email,
      });

    return h.response({message: "Task updated successfully", token,result}).code(200);
}