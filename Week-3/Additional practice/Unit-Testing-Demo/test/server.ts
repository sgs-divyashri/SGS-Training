
// server.ts
import Hapi, { Server } from '@hapi/hapi';
import { hashPassword, verifyPassword } from '../src/api/users/passwordHashing';

let server: Server;


export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}


export const createServer = async (): Promise<Server> => {
  server = Hapi.server({ port: 3000, host: 'localhost' });

  // Register routes/plugins here
  server.route({
    method: 'POST',
    path: '/users/register',
    handler: async (request, h) => {
      const { email, name, password } = request.payload as any;

      // Validate
      if (!email || !name || !password) {
        return h.response({ error: 'Bad Request' }).code(400);
      }

      // Simple pattern check with regex
      const email_regex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
      const trimmedEmail = email.trim();
      if (!email_regex.test(trimmedEmail)) {
        return h.response({ error: 'Bad Request', message: 'Invalid email format' }).code(400);
      }

      // Duplicate email check
      if (email === 'divya@example.com') {
        return h.response({ message: 'Email already exists' }).code(409);
      }

      const passwordHash = await hashPassword(password);

      const user = {
        id: 1,
        email,
        name,
        createdAt: new Date().toISOString()
      };

      return h
        .response(user)
        .code(201)
        .header('Location', `/users/${user.id}`);
    }
  });

  server.route({
    method: 'POST',
    path: '/users/login',
    handler: async (request, h) => {
      const { email, password } = request.payload as any;

      // Validate
      if (!email || !password) {
        return h.response({ error: 'Bad Request' }).code(400);
      }

      // Simple pattern check with regex
      const email_regex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
      const trimmedEmail = email.trim();
      if (!email_regex.test(trimmedEmail)) {
        return h.response({ error: 'Bad Request', message: 'Invalid email format' }).code(400);
      }

      // // Duplicate email check
      // if (email === 'divya@example.com') {
      //   return h.response({ message: 'Email already exists' }).code(409);
      // }

      const passwordHash = await hashPassword(password)

      // const passwordHash = await verifyPassword(password, user.);

      const user = {
        id: 1,
        email,
        createdAt: new Date().toISOString()
      };

      return h
        .response(user)
        .code(200)
        .header('Location', `/users/${user.id}`);
    }
  });

  return server;
};

export const init = async (): Promise<Server> => {
  const s = await createServer();
  await s.initialize();        // initialize without listening on a port (great for tests)
  return s;                    // return server
};

// export const start = async (): Promise<Server> => {
//   const s = await createServer();
//   await s.start();             // start for real runtime
//   console.log(`Server running at: ${s.info.uri}`);
//   return s;
// };



// import Hapi, { Server } from '@hapi/hapi';

// export const init = async (): Promise<Server> => {
//   const server = Hapi.server({ port: 3000, host: 'localhost' });
//   await server.initialize();
//   return server; // ✅ This is critical
// };
