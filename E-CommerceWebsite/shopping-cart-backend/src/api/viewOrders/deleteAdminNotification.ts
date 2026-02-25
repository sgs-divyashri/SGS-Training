import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { cartItemsServices } from "../../services/cartItemsServices";
import { notifyOrderServices } from "../../services/userNotificationServices";
import { viewOrderServices } from "../../services/viewOrderServices";

export const deleteAdminNotificationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const viewOrderId = request.params.id as string;

    if (!viewOrderId) {
      return h.response({ error: 'Invalid Order ID' }).code(400);
    }

    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }

    const deletedID = await viewOrderServices.deleteAdminNotification(viewOrderId);
    if (!deletedID) {
      return h.response({ error: 'Order not found' }).code(404);
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