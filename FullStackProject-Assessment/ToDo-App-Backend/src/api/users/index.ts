import type { ServerRoute } from "@hapi/hapi";
import { createUserHandler } from "./createUsers";
import { loginUserHandler } from "./userLogin";
import { getUserHandler } from "./getAllUsers";
import { deleteUserHandler } from "./deleteUsers";

export const userRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/create-user",
    handler: createUserHandler,
  },

  {
    method: "POST",
    path: "/user/login",
    handler: loginUserHandler,
    options: {
      auth: false,
    },
  },

  {
    method: "GET",
    path: "/users",
    handler: getUserHandler,
  },

  {
    method: "DELETE",
    path: "/user/{id}",
    handler: deleteUserHandler,
  },
];
