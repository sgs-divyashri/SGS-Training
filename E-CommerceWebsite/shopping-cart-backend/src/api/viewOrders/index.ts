import type { ServerRoute } from "@hapi/hapi";
import { viewAllOrdersHandler } from "./viewAllOrders";
// import { editViewOrderStatusHandler } from "./editOrderStatus";
import { deleteAdminNotificationHandler } from "./deleteAdminNotification";
import { sendAdminStatusHandler } from "./sendAdminStatus";

export const viewOrderRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/orders/view",
    handler: viewAllOrdersHandler,
  },

  // {
  //   method: "PATCH",
  //   path: "/order/view/status/{id}",
  //   handler: editViewOrderStatusHandler,
  // },

  {
    method: "PATCH",
    path: "/order/status/{id}",
    handler: sendAdminStatusHandler
  },

  {
    method: "DELETE",
    path: "/order/{id}",
    handler: deleteAdminNotificationHandler,
  },
];
