import { Request, ResponseToolkit } from "@hapi/hapi";
import { testServices } from "../../services/testServices";

export const getSpecificDataHandler = async (request: Request, h: ResponseToolkit) => {
    const id = Number(request.params.id);
    const specificData = await testServices.getSpecificData(id);

    if (!specificData) {
      return h.response({ error: "Data not found" }).code(404);
    }

    return h.response({message: `User ID ${id} retrieved successfully`,user: specificData}).code(200);
}