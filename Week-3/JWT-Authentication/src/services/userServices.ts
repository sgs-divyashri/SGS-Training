import { hashPassword } from "../api/users/passwordHashing";
import { verifyPassword } from "../api/users/passwordHashing";

export interface User {
  id: number,
  name: string,
  email: string,
  password: string,
  age: number,
  createdAt: string,
  updatedAt: string,
  isActive: boolean
}

export interface AuthResponse {
  token: string;
  user: User;
}

let nextId = 1;
export const users: User[] = [];

export const userServices = {
  emailExists(email: string) {
    return users.some(u => u.email === email);
  },
  
  createUser: (user: Partial<User>): User => {
    const newUser: User = {
      id: nextId++,
      name: user.name!,
      email: user.email!,
      password: hashPassword(user.password!),
      age: user.age!,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      isActive: true
    }

    users.push(newUser);
    return newUser;
  },

  loginUser: (loginData: Pick<User, "email"|"password">): User | null => {
    const user = users.find(user => user.email === loginData.email && user.isActive===true)
    if (!user) return null;

    const isValidPassword = verifyPassword(loginData.password, user.password);
    if (!isValidPassword) return null;

    return user
  },
 
  getAllUsers: (): User[] => {
    return users.filter(t => t.isActive === true)
  },

  getSpecificUser: (id: number): User => {
    return users.find(t => t.id === id && t.isActive === true)!;
  },

  fullUpdateUser: (id: number, payload: Pick<User, "name"|"email"|"password"|"age">): null | string | User => {
    const user = users.find(t => t.id === id && t.isActive);
    if (!user) {
      return null;  // service should not return an Hapi response
    }

    // Validate full update: All fields required
    if (!payload.name || !payload.email || !payload.password || !payload.age) {
      return "MISSING_FIELDS";
    }

    // Apply full update
    user.name = payload.name;
    user.email = payload.email;
    user.password = hashPassword(payload.password);
    user.age = payload.age;

    user.updatedAt = new Date().toLocaleString();

    return user;
  },

  partialUpdateUser: (id: number, payload: Partial<User>): null | User => {
    const user = users.find(t => t.id === id && t.isActive);
    if (!user) {
      return null
    }

    // PARTIAL UPDATE (update only fields sent)
    if (payload.name !== undefined) user.name = payload.name;
    if (payload.email !== undefined) user.email = payload.email;
    if (payload.password !== undefined) user.password = hashPassword(payload.password);
    if (payload.age !== undefined) user.age = payload.age;

    user.updatedAt = new Date().toLocaleString();

    return user
  },

  softDeleteUser: (id: number): User | null => {
    const user = users.find((t) => t.id === id && t.isActive === true)
    if (!user) {
      return null;
    }
    user.isActive = false
    user.updatedAt = new Date().toLocaleString();
    return user
  },

};


