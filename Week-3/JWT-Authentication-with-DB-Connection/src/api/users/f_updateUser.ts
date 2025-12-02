import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { UserPayload } from "../../services/userServices";

export const fullUpdateUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {

    const id = Number(request.params.id);
    const payload = request.payload as Pick<UserPayload, "name" | "email" | "password" | "age">;

    const user = await userServices.fullUpdateUser(id, payload);

    if (user === null) {
      return h.response({ error: "User not found" }).code(404); 
    }

    return h.response({
      message: " Fully Updated Users successfully",
      user: user,
    }).code(200);

  }
  catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }

}