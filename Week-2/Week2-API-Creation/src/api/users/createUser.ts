import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices"
import { normalizedEmail, validateEmail } from "./emailValidation";

export const createUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const payload = request.payload as User
    // const {name, email, password, age} = request.payload as {name: string, email: string, password: string, age: number};
    // Basic validation
    if (!payload.name || !payload.email || !payload.password || !payload.age) {
        return h.response({error: 'Name, Email, Password and Age are required'}).code(400);
    }

    // Email format validation
    if (!validateEmail(payload.email)) {
        return h.response({ error: "Invalid email format" }).code(400);
    }

    const cleanEmail = normalizedEmail(payload.email)

    if (userServices.emailExists(cleanEmail)) {
        return h.response({ error: "Email already exists" }).code(409);
    }

    const newUserId: number = userServices.createUser({
        name: payload.name,
        email: cleanEmail,
        password: payload.password,
        age: payload.age
    })

    return h.response({message: 'User added successfully', userID: newUserId}).code(201);

}