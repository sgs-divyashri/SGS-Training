import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { UserPayload } from "../../models/userTableDefinition";
import { passwordServices } from "../../services/passwordservices";

export const fullUpdateUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = Number(request.params.id);
    const payload = request.payload as Pick<UserPayload, "name" | "email" | "password" | "age">;

    if (!payload.name || !payload.email || !payload.password || !payload.age) {
      return h.response({ error: "Invalid payload" }).code(400)
    }

    const policy = passwordServices.validatePasswordPolicy(payload.password);

    if (!policy.ok) {
      return h.response({ error: 'Weak password', reasons: policy.errors }).code(400);
    }


    const user = await userServices.fullUpdateUser(id, payload);
    // console.log("User: ", user)

    if (user === null) {
      return h.response({ error: "User not found or already deleted" }).code(404);
    }

    return h.response({
      message: " Fully Updated Users successfully",
      user: user,
    }).code(200);

  }
  catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
}