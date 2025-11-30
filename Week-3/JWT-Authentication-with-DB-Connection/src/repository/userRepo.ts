import { UserPayload } from "../services/userServices";
import { User } from "../api/users/userTableDefinition";
import { hashPassword } from "../api/users/passwordHashing";
import { verifyPassword } from "../api/users/passwordHashing";
import { Model } from "sequelize";

export const userRepository = {
    createUser: async (payload: Partial<UserPayload>) => {
        const newUser = await User.create({ ...payload, password: hashPassword(payload.password!) });
        return newUser
    },

    loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<Model<any, any> | null> => {
        const user = await User.findOne({ where: { email: loginData.email, isActive: true } });
        if (!user) return null;

        // Access password safely
        const hashedPassword = user.getDataValue("password");
        const isValidPassword = await verifyPassword(loginData.password, hashedPassword);
        if (!isValidPassword) return null;

        return user;
    },

    getAllUsers: (): Promise<Model<any, any>[]> => {
        const users = User.findAll({ where: { isActive: true } });
        return users
    },

    getSpecificUser: (id: number): Promise<Model<any, any> | null> => {
        const user = User.findByPk(id)
        return user
    },

    fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">) => {
        const [rowsUpdated, [updatedUser]] = await User.update({ ...payload, password: hashPassword(payload.password) }, { where: { userId: id, isActive: true }, returning: true })
        if (rowsUpdated === 0) {
            return null;  // service should not return an Hapi response
        }

        return updatedUser
    },

    softDeleteUser: async (id: number) => {
        const [affectedRows] = await User.update({ isActive: false }, { where: { userId: id, isActive: true } });
        if (affectedRows === 0) {
            // No rows updated → either task doesn't exist or already deleted
            throw new Error(`User with ID ${id} not found or already deleted`);
        }
        return id;
    }
}