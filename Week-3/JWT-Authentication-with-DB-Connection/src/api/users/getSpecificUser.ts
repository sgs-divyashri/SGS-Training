import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { Model } from "sequelize";
import { User } from "../../models/userTableDefinition";

export const getSpecificUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {

    const id = Number(request.params.id);
    const specificUser: User | null = await userServices.getSpecificUser(id);

    if (!specificUser) {
      return h.response({ error: "User not found or already deleted" }).code(404);
    }

    return h
      .response({
        message: `User ID ${id} retrieved successfully`,
        user: specificUser
      })
      .code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }

}