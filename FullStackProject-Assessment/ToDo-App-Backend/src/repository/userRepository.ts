import { UserPayload, User } from "../models/userTableDefinition";
import { passwordServices } from "../services/passwordServices";
import { v4 as uuid} from 'uuid'

export const userRepository = {
  createUser: async (
    payload: Pick<UserPayload, "name" | "email" | "password" | "role">,
  ): Promise<User> => {
    const newUser = await User.create({
      ...payload,
      userId: uuid(),
      password: passwordServices.hashPassword(payload.password),
    });
    return newUser;
  },

  loginUser: async (
    loginData: Pick<UserPayload, "email" | "password">,
  ): Promise<User | null> => {
    const user = await User.findOne({
      where: { email: loginData.email, isActive: true },
      attributes: { include: ["password"] },
    });
    if (!user) return null;

    const hashedPassword: string = user.password;
    const isValidPassword = passwordServices.verifyPassword(
      loginData.password,
      hashedPassword,
    );
    if (!isValidPassword) return null;

    return user;
  },

  getAllUsers: (): Promise<User[]> => {
    const users = User.findAll({
        where: {role: 'User'}
    });
    return users;
  },

  deleteUser: async (id: string): Promise<string | undefined> => {
    const count = await User.destroy({ where: { userId: id } });
    return count > 0 ? id : undefined;
  },
};
