// routes/handlers/getMyOrderStatuses.ts
import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { Orders } from "../../models/ordersTableDefinition";
import { placeOrderServices } from "../../services/placeOrderServices";

export const getAdminOrderStatus = async (
  request: Request,
  h: ResponseToolkit
): Promise<ResponseObject> => {
  try {
    const userId = Number(request.auth.credentials.userId);
    if (!userId) return h.response({ error: "Unauthorized" }).code(401);

    const result = await placeOrderServices.getAdminStatus(userId);

    return h.response({ orderStatus: result }).code(200);
  } catch (e: any) {
    return h.response({ error: e.message || "Server error" }).code(500);
  }
};