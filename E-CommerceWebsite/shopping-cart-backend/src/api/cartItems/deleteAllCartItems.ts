import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { cartItemsServices } from "../../services/cartItemsServices";

export const deleteAllCartItemsHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = Number(request.params.userId);

    if (!id) {
      return h.response({ error: 'Invalid user ID' }).code(400);
    }

    // const userId = Number(request.auth.credentials.userId);

    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "user") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }

    const deletedID = await cartItemsServices.deleteAllCartItems(id);
    if (!deletedID) {
      return h.response({ error: 'User not found' }).code(404);
    }

    return h.response({
      message: "Deleted All Products successfully",
      userID: deletedID,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error"}).code(500);
  }
}