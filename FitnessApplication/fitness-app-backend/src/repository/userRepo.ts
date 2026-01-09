import { User } from "../models/userTableDefinition";
import { passwordServices } from "../service/passwordServices";
import { UserPayload } from "../models/userTableDefinition";

export const userRepository = {
    createUser: async (payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User> => {
        const newUser = await User.create({ ...payload, password: passwordServices.hashPassword(payload.password) });
        return newUser
    },

    loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
        const user = await User.findOne({ where: { email: loginData.email, isActive: true }, attributes: { include: ["password"] } });
        if (!user) return null;

        const hashedPassword: string = user.password;
        const isValidPassword = passwordServices.verifyPassword(loginData.password, hashedPassword);
        if (!isValidPassword) return null;

        return user;
    }
}