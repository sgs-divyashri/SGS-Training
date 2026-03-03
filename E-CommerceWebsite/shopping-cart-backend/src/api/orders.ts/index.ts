import type { ServerRoute } from "@hapi/hapi";
import { addPlaceOrderHandler } from "./addPlaceOrders";
import { getAllOrdersHandler } from "./getAllOrders";
import { cancelOrdersHandler } from "./cancelOrder";
import { deleteOrderHandler } from "./deleteOrder";

export const userOrderRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/orders/place",
    handler: addPlaceOrderHandler,
  },

  {
    method: "GET",
    path: "/orders",
    handler: getAllOrdersHandler,
  },

  // {
  //   method: "GET",
  //   path: "/order-status",
  //   handler: getAdminOrderStatus,
  // },

  {
    method: "PATCH",
    path: "/cancel-order/{id}",
    handler: cancelOrdersHandler,
  },

  {
    method: "DELETE",
    path: "/delete-order/{id}",
    handler: deleteOrderHandler
  },
];
