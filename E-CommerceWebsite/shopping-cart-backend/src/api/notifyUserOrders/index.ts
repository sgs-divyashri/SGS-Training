import type { ServerRoute } from "@hapi/hapi";
import { getAllOrderNotificationsHandler } from "./getAllNotifications";
import { deleteOrderNotificationHandler } from "./deleteNotification";

export const orderNotificationRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/notify-orders",
    handler: getAllOrderNotificationsHandler,
  },

  {
    method: "DELETE",
    path: "/notify-orders/{id}",
    handler: deleteOrderNotificationHandler,
  },
];
