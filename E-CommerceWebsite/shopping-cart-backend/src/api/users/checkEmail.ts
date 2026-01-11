import { UserPayload } from "../../models/userTableDefinition";
import { userServices } from "../../services/userServices";
import { ResponseToolkit, Request } from "@hapi/hapi";
import { normalize } from "node:path";

export const checkEmail = async(request: Request, h: ResponseToolkit) => {
    const payload = request.payload as Pick<UserPayload, "email">
    const validEmail = normalize(payload.email)
    if (!validEmail) {
        return h.response({available: false, error: "Enter correct Email Pattern" }).code(400);
    }
    const existingUser = await userServices.findByEmail(validEmail);
    if (existingUser) {
        return h.response({available: false, error: "Email already registered" }).code(409);
    }
    return h.response({available: true, message: "Unique email" }).code(200);
}