import type { ServerRoute } from "@hapi/hapi";

interface User {
    ID: number,
    Name: string,
    Email: string,
    Password: string,
    Age: number,
    CreatedAt: string;
    UpdatedAt: string;
    isActive: boolean
}

export const users:any[] = [];
let nextId: number = 1;

export const userRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/',
        handler: () => {return 'Hello users!'}
    },

    {
        method: 'GET',
        path: '/users',
        handler: () => {return users.filter(t => t.isActive === true)}
    },

    {
        method: 'GET',
        path: '/users/{id}',
        handler: (request, h) => {
            const id = parseInt(request.params.id);
            const user = users.find(t => t.ID === id && t.isActive===true);
            if (!user) {
                return h.response({ error: 'Task not found' }).code(404);
            }
            return user;
        }
    },

    {
        method: 'POST',
        path: '/users',
        handler: (request, h) => {
            const {Name, Email, Password, Age} = request.payload as {Name: string, Email: string, Password: string, Age: number};
            // Basic validation
            if (!Name || !Email || !Password || !Age) {
                return h.response({ 
                    error: 'Name, Email, Password and Age are required' 
                }).code(400);
            }

            const newUser: User = {
                ID: nextId++,
                Name,
                Email,
                Password,
                Age,
                CreatedAt: new Date().toLocaleString(),
                UpdatedAt: new Date().toLocaleString(),
                isActive: true
            };

            users.push(newUser);
            return h.response({ 
                message: 'User added successfully', 
                user: newUser  
            }).code(201);
        }
    },

    {
        method: "PUT",
        path: "/users/f_update/{id}",
        handler: (request, h) => {
            const id = parseInt(request.params.id);
            const payload = request.payload as Partial<User>;

            const user = users.find(t => t.ID === id && t.isActive);
            if (!user) {
                return h.response({ error: "Task not found" }).code(404);
            }

            // Validate: all fields must be present
            if (!payload.Name || !payload.Email || !payload.Password || !payload.Age) {
                return h.response({
                    error: "TaskName, Description and Status are required for full update"
                }).code(400);
            }

            // FULL UPDATE
            user.Name = payload.Name;
            user.Email = payload.Email;
            user.Password = payload.Password;
            user.Age = payload.Age;

            user.UpdatedAt = new Date().toLocaleString();

            return h.response({
                message: "Task fully updated",
                user
            }).code(200);
        }
    },
    
    {
        method: "PATCH",
        path: "/users/p_update/{id}",
        handler: (request, h) => {
            const id = parseInt(request.params.id);
            const payload = request.payload as Partial<User>;

            const user = users.find(t => t.ID === id && t.isActive);
            if (!user) {
                return h.response({ error: "Task not found" }).code(404);
            }

            // PARTIAL UPDATE (update only fields sent)
            if (payload.Name !== undefined) user.Name = payload.Name;
            if (payload.Email !== undefined) user.Email = payload.Email;
            if (payload.Password !== undefined) user.Password = payload.Password;
            if (payload.Age !== undefined) user.Age = payload.Age;

            user.UpdatedAt = new Date().toLocaleString();

            return h.response({
                message: "Task updated successfully",
                user
            }).code(200);
        }
    },

    {
        method: 'DELETE',
        path: '/users/{id}',
        handler: (request, h) => {
            const id = parseInt(request.params.id);
            const user = users.find((t) => t.ID === id && t.isActive===true)
    
            if (!user) {
                return h.response({ error: 'User not found' }).code(404);
            }
            return user.isActive=false

        }
    }
]