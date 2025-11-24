import { ServerRoute } from '@hapi/hapi';
import { UserController } from '../users/user.controller';

export const authRoutes: ServerRoute[] = [
  // Public routes
  {
    method: 'POST',
    path: '/auth/register',
    handler: UserController.register,
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: UserController.login,
    options: {
      auth: false,
    },
  },

  // Protected routes
  {
    method: 'GET',
    path: '/auth/profile',
    handler: UserController.getProfile,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/auth/users',
    handler: UserController.getAllUsers,
    options: {
      auth: 'jwt',
    },
  },
];