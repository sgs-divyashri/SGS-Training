import type { ServerRoute } from "@hapi/hapi";
import { viewAllOrdersHandler } from "./viewAllOrders";
import { editViewOrderStatusHandler } from "./editOrderStatus";

export const viewOrderRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/orders/view",
    handler: viewAllOrdersHandler,
  },

  {
    method: "PATCH",
    path: "/order/view/status/{id}",
    handler: editViewOrderStatusHandler,
  },

  //   {
  //     method: "DELETE",
  //     path: "/order/{id}",
  //     handler: cancelOrdersHandler,
  //   },
];
