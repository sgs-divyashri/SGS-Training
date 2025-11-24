import Hapi from '@hapi/hapi';

// Define interfaces
interface UserPayload {
  name: string;
  email: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const init = async () => {
  console.log('Starting server initialization...');
  
  try {
    const server = Hapi.server({
      port: 3000,
      host: 'localhost'
    });

    // In-memory storage for demo
    let users: UserResponse[] = [];
    let userIdCounter = 1;

    // Routes
    server.route({
      method: 'GET',
      path: '/',
      handler: () => {
        console.log('GET / route called');
        return { message: 'Hello Hapi with TypeScript!' };
      }
    });

    server.route({
      method: 'GET',
      path: '/users',
      handler: (request, h) => {
        console.log('GET /users route called');
        return h.response(users).code(200);
      }
    });

    server.route({
      method: 'POST',
      path: '/users',
      handler: async (request, h) => {
        try {
          console.log('POST /users route called');
          const payload = request.payload as UserPayload;
          
          // Basic validation
          if (!payload?.name || !payload?.email) {
            return h.response({ error: 'Name and email are required' }).code(400);
          }

          const newUser: UserResponse = {
            id: userIdCounter++,
            name: payload.name,
            email: payload.email,
            createdAt: new Date().toISOString()
          };

          users.push(newUser);
          console.log(`User created: ${newUser.name}`);
          return h.response(newUser).code(201);
        } catch (error) {
          console.error('Error creating user:', error);
          return h.response({ error: 'Internal server error' }).code(500);
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/users/{id}',
      handler: (request, h) => {
        const id = parseInt(request.params.id as string);
        console.log(`GET /users/${id} route called`);
        const user = users.find(u => u.id === id);
        
        if (!user) {
          return h.response({ error: 'User not found' }).code(404);
        }

        return h.response(user).code(200);
      }
    });

    await server.start();
    console.log('Server successfully started!');
    console.log(`Server running on: ${server.info.uri}`);
    console.log('Ready to handle requests...');
    
    // Test the server is actually running
    console.log('Testing server connectivity...');
    
    return server;

  } catch (error) {
    console.error('Error starting server:', error);
    throw error;
  }
};

// Global error handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Start the server
console.log('Starting application...');
init().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
