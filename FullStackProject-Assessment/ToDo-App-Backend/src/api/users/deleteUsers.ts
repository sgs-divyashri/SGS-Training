import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";

export const deleteUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.id as string;

    if (!id) {
      return h.response({ error: 'Invalid product ID' }).code(400);
    }

    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }

    const deletedID = await userServices.deleteUser(id);
    if (!deletedID) {
      return h.response({ error: 'User not found' }).code(404);
    }

    return h.response({
      message: "Deleted Product successfully",
      deletedID: deletedID,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error"}).code(500);
  }
}