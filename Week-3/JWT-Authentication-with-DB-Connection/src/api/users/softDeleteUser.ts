import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";

export const softDeleteUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {

    const id = Number(request.params.userID);

    if (!id || isNaN(Number(id))) {
      return h.response({ error: 'Invalid user ID' }).code(400);
    }

    const user = await userServices.softDeleteUser(id);
    if (user === null) {
      return h.response({ error: 'User not found or already deleted' }).code(404);
    }

    return h.response({
      message: "Soft Deleted User successfully",
      user: user,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }
}