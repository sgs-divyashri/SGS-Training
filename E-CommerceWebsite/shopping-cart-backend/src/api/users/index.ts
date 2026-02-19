import type { ServerRoute } from "@hapi/hapi";
import { registerUserHandler } from "./registerUser";
import { loginUserHandler } from "./userLogin";
import { refreshTokenHandler } from "./refreshToken";
import { checkEmail } from "./checkEmail";
import { forgotPasswordUserHandler } from "./forgotPassword";
import { resetPasswordHandler } from "./resetPassword";

export const userRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/users/register",
    handler: registerUserHandler,
    options: {
      auth: false,
    },
  },

  {
    method: "POST",
    path: "/users/check-email",
    handler: checkEmail,
    options: {
      auth: false,
    },
  },

  {
    method: "POST",
    path: "/users/login",
    handler: loginUserHandler,
    options: {
      auth: false,
    },
  },

  {
    method: "POST",
    path: "/token/refresh",
    handler: refreshTokenHandler,
    options: {
      auth: false,
    },
  },

  {
    method: "POST",
    path: "/users/forgot-password",
    handler: forgotPasswordUserHandler,
    options: {
      auth: false,
    },
  },

  {
    method: "POST",
    path: "/users/reset-password",
    handler: resetPasswordHandler,
    options: {
      auth: false,
    },
  },
];
