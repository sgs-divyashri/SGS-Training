  import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
  import { userServices } from "../../services/userServices";
  import { UserPayload } from "../../models/userTableDefinition";

  export const partialUpdateUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {

      const id = Number(request.params.id);
      const payload = request.payload as Partial<UserPayload>;

      console.log("Payload: ", payload)

      const user = await userServices.partialUpdateUser(id, payload);

      if (user === null) {
        return h.response({ error: "User not found" }).code(404); 
      }

      console.log(user)

      return h.response({
        message: "Partially Updated Users successfully",
        user: user,
      }).code(200);

    } catch (err) {
      console.error("ERROR IN partialUpdateTaskHandler:", err);
      return h.response({ error: "Invalid token" }).code(401);
    }
  }