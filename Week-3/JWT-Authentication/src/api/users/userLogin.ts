import { Request, ResponseToolkit } from '@hapi/hapi';
import { User, userServices } from "../../services/userServices";
import { AuthResponse } from '../../services/userServices';
import { generateToken } from './authentication';

export const loginUserHandler = (request: Request, h: ResponseToolkit) => {
    try {
      const payload = request.payload as Pick<User, "email"|"password">;

      // Basic validation
      if (!payload.email || !payload.password) {
        return h.response({
          error: 'Email and password are required'
        }).code(400);
      }

      // Validate credentials
      const user = userServices.loginUser(payload);
      if (!user) {
        return h.response({
          error: 'Invalid email or password'
        }).code(401);
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id!,
        email: user.email,
      });

      const response: AuthResponse = {
        token,
        user,
      };

      return h.response({message: 'Login successful',...response,}).code(200);

    } catch (error) {
      console.error('Login error:', error);
      return h.response({ error: 'Internal server error' }).code(500);
    }
  }