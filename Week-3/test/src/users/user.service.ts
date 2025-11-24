import { CreateUserDto, LoginDto, User } from './user.model';
import { hashPassword, verifyPassword } from '../auth/auth.service';

// In-memory storage
let users: User[] = [];
let nextId = 1;

export class UserService {
  // Find user by email (synchronous)
  static findByEmail(email: string): User | null {
    return users.find(user => user.email === email) || null;
  }

  // Find user by ID (synchronous)
  static findById(id: number): Omit<User, 'password'> | null {
    const user = users.find(user => user.id === id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Create new user (synchronous)
  static create(userData: CreateUserDto): Omit<User, 'password'> {
    // Check if user already exists
    const existingUser = this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: nextId++,
      name: userData.name,
      email: userData.email,
      password: hashPassword(userData.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Validate user credentials (synchronous)
  static validateCredentials(loginData: LoginDto): Omit<User, 'password'> | null {
    const user = this.findByEmail(loginData.email);
    if (!user) return null;

    const isValidPassword = verifyPassword(loginData.password, user.password);
    if (!isValidPassword) return null;

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get all users (synchronous)
  static getAll(): Omit<User, 'password'>[] {
    return users.map(({ password, ...user }) => user);
  }
}