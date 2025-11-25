import { Request, ResponseToolkit } from '@hapi/hapi';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUser, Login, AuthResponse } from './user.model';

export class UserController {
  // Register new user (synchronous)
  static register(request: Request, h: ResponseToolkit) {
    try {
      const payload = request.payload as CreateUser;

      // Basic validation
      if (!payload.name || !payload.email || !payload.password) {
        return h.response({
          error: 'Name, email and password are required'
        }).code(400);
      }

      // Create user
      const user = UserService.create(payload);

      // Generate JWT token
      const token = AuthService.generateToken({
        userId: user.id!,
        email: user.email,
      });

      const response: AuthResponse = {
        token,
        user,
      };

      return h.response({
        message: 'User registered successfully',
        ...response,
      }).code(201);

    } catch (error: any) {
      if (error.message === 'User already exists') {
        return h.response({ error: 'User already exists' }).code(409);
      }

      console.error('Registration error:', error);
      return h.response({ error: 'Internal server error' }).code(500);
    }
  }

  // Login user (synchronous)
  static login(request: Request, h: ResponseToolkit) {
    try {
      const payload = request.payload as Login;

      // Basic validation
      if (!payload.email || !payload.password) {
        return h.response({
          error: 'Email and password are required'
        }).code(400);
      }

      // Validate credentials
      const user = UserService.validateCredentials(payload);
      if (!user) {
        return h.response({
          error: 'Invalid email or password'
        }).code(401);
      }

      // Generate JWT token
      const token = AuthService.generateToken({
        userId: user.id!,
        email: user.email,
      });

      const response: AuthResponse = {
        token,
        user,
      };

      return h.response({
        message: 'Login successful',
        ...response,
      }).code(200);

    } catch (error) {
      console.error('Login error:', error);
      return h.response({ error: 'Internal server error' }).code(500);
    }
  }

  // Get current user profile (synchronous)
  static getProfile(request: Request, h: ResponseToolkit) {
    try {
      const userId = request.auth.credentials.userId as number;
      const user = UserService.findById(userId);

      if (!user) {
        return h.response({ error: 'User not found' }).code(404);
      }

      return h.response({
        message: 'Profile retrieved successfully',
        user,
      }).code(200);

    } catch (error) {
      console.error('Get profile error:', error);
      return h.response({ error: 'Internal server error' }).code(500);
    }
  }

  // Get all users (synchronous)
  static getAllUsers(request: Request, h: ResponseToolkit) {
    try {
      const users = UserService.getAll();
      return h.response({
        message: 'Users retrieved successfully',
        users,
      }).code(200);
    } catch (error) {
      console.error('Get users error:', error);
      return h.response({ error: 'Internal server error' }).code(500);
    }
  }
}