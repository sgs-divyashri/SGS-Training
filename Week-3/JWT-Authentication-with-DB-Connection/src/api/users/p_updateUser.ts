import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { UserPayload } from "../../models/userTableDefinition";
import { passwordServices } from "../../services/passwordservices";

export const partialUpdateUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = Number(request.params.id);
    const payload = request.payload as Partial<UserPayload>;

    console.log("Payload: ", payload)


    if (payload.password !== undefined) {
      const policy = passwordServices.validatePasswordPolicy(payload.password);
      if (!policy.ok) { 
        return h.response({ error: 'Weak password', reasons: policy.errors }).code(400);
      }
      payload.password = passwordServices.hashPassword(payload.password);
      
    }

    const user = await userServices.partialUpdateUser(id, payload);

    if (user === null) {
      return h.response({ error: "User not found or already deleted" }).code(404);
    }

    return h.response({
      message: "Partially Updated Users successfully",
      user: user,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN partialUpdateTaskHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }
}