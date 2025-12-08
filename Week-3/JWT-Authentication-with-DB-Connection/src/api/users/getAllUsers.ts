import { ResponseToolkit, ResponseObject, Request } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../models/userTableDefinition";
import { error } from "console";

export const getUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const allUsers: User[] = await userServices.getAllUsers();

    if (!allUsers){
      h.response({error: "All users not found"}).code(400)
    }

    return h.response({
      message: "Retrieved All Users successfully",
      users: allUsers,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};


