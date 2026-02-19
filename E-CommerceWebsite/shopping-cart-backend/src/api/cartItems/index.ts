import type { ServerRoute } from "@hapi/hapi";
import { addCartItemHandler } from "./addCartItem";
import { getAllCartItemsHandler } from "./getAllCartItem";
import { deleteCartItemHandler } from "./deleteCartItem";
import { editCartItemHandler } from "./editCartItem";
import { deleteAllCartItemsHandler } from "./deleteAllCartItems";

export const cartItemRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/cart/add",
    handler: addCartItemHandler,
  },

  {
    method: "GET",
    path: "/cart-items",
    handler: getAllCartItemsHandler,
  },

  {
    method: "PATCH",
    path: "/cart/edit/{id}/{userId}",
    handler: editCartItemHandler,
  },

  {
    method: "DELETE",
    path: "/cart-item/{id}",
    handler: deleteCartItemHandler,
  },

  {
    method: "DELETE",
    path: "/all-cart-item/{userId}",
    handler: deleteAllCartItemsHandler,
  },
];
