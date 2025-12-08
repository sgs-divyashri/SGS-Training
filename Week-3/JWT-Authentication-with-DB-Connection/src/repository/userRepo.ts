import { userServices } from "../services/userServices";
import { User } from "../models/userTableDefinition";
import { hashPassword } from "../api/users/passwordHashing";
import { verifyPassword } from "../api/users/passwordHashing";
import { Model } from "sequelize";
import { UserPayload } from "../models/userTableDefinition";

export const userRepository = {
    createUser: async (payload: Pick<UserPayload, "name"|"email"|"password"|"age">): Promise<User> => {
        const newUser = await User.create({ ...payload, password: hashPassword(payload.password!) });
        return newUser
    },

    loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
        const user = await User.findOne({ where: { email: loginData.email, isActive: true }, attributes: {include: ["password"]} });
        if (!user) return null;
        // console.log(user)

        // Access password safely
        const hashedPassword: string = user.getDataValue("password");
        // console.log("Hashed password for login user: ",hashedPassword)
        const isValidPassword = verifyPassword(loginData.password, hashedPassword);
        if (!isValidPassword) return null;
        
        return user;
    },

    getAllUsers: (): Promise<User[]> => {
        const users = User.findAll({ where: { isActive: true } });
        return users
    },

    getSpecificUser: async (id: number): Promise<User | null> => {
        const user = await User.findOne({ where: { userId: id, isActive: true } })
        return user
    },

    fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User | null | undefined> => {
        const [rowsUpdated, [updatedUser]] = await User.update({ ...payload, password: hashPassword(payload.password) }, { where: { userId: id, isActive: true }, returning: true })
        if (rowsUpdated === 0) {
            return null; 
        }

        return updatedUser
    },


    partialUpdateUser: async (id: number, payload: Partial<UserPayload>): Promise<UserPayload | null> => {
        const user = await User.findOne({ where: { userId: id, isActive: true } });
        if (!user) return null;

        if (payload.name !== undefined) user.set('name', payload.name);
        if (payload.email !== undefined) user.set('email', payload.email);
        if (payload.password !== undefined) user.set('password', hashPassword(payload.password));
        if (payload.age !== undefined) user.set('age', payload.age);

        await user.save();
        return user.get();
    },

    softDeleteUser: async (id: number): Promise<number> => {
        const [affectedRows] = await User.update({ isActive: false }, { where: { userId: id, isActive: true } });
        if (affectedRows === 0) {
            throw new Error(`User with ID ${id} not found or already deleted`);
        }
        return id;
    }
}