import type { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { productServices } from "../../services/productServices";
import { placeOrderServices } from "../../services/placeOrderServices";
import { viewOrderServices } from "../../services/viewOrderServices";
import { notifyOrderServices } from "../../services/userNotificationServices";

export const getAllOrderNotificationsHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const result = await notifyOrderServices.getAllOrderNotifications();

    return h
      .response({
        message: "Retrieved orders successfully",
        notifications: result.items
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};
