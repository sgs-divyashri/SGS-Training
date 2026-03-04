import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { ViewOrdersPayload } from "../../types/viewOrdersPayload";
import { ViewOrders } from "../../models/adminViewOrderNotifyTableDefinition";
import { placeOrderServices } from "../../services/placeOrderServices";
import { viewOrderServices } from "../../services/viewOrderServices";

export const sendAdminStatusHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const { orderId, productId } = request.params as { orderId: string; productId: string };
    const role = String(request.auth.credentials.role ?? "").trim().toLowerCase()

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions"}).code(403);
    }
    const {status} = request.payload as {status: "" | "ACCEPTED" | "REJECTED"};

    const ord = await ViewOrders.findOne({ where: { orderId } });
    if (!ord) return h.response({ error: "Order not found" }).code(404);

    const product = await viewOrderServices.sendAdminStatus(orderId, productId, status);

    return h
      .response({
        message: "Edited Product successfully",
        product: product,
      })
      .code(200);
  } catch (err: any) {
    console.error("ERROR:", err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
