import { User } from "../models/userTableDefinition";
import { passwordServices } from "../services/passwordservices";
import { UserPayload } from "../models/userTableDefinition";

export const userRepository = {
    createUser: async (payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User> => {
        const newUser = await User.create({ ...payload, password: passwordServices.hashPassword(payload.password) });
        return newUser
    },

    loginUser: async (loginData: Pick<UserPayload, "email" | "password">): Promise<User | null> => {
        const user = await User.findOne({ where: { email: loginData.email, isActive: true }, attributes: { include: ["password"] } });
        if (!user) return null;

        // Access password safely
        const hashedPassword: string = user.password;
        // console.log("Hashed password for login user: ",hashedPassword)
        const isValidPassword = passwordServices.verifyPassword(loginData.password, hashedPassword);
        if (!isValidPassword) return null;

        return user;
    },

    getAllUsers: (): Promise<User[]> => {
        const users = User.findAll();
        return users
    },

    getSpecificUser: async (id: number): Promise<User | null> => {
        const user = await User.findOne({ where: { userId: id } })
        return user
    },

    fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User | null | undefined> => {
        const [rowsUpdated, [updatedUser]] = await User.update({ ...payload, password: passwordServices.hashPassword(payload.password) }, { where: { userId: id }, returning: true })
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
        if (payload.password !== undefined) user.set('password', passwordServices.hashPassword(payload.password));
        if (payload.age !== undefined) user.set('age', payload.age);

        await user.save();
        return user.get();
    },

    // restoreUser: async (id: number): Promise<User | null> => {
    //     const [affectedRows] = await User.update({ isActive: true }, { where: { userId: id, isActive: false } });
    //     if (affectedRows === 0) {
    //         throw new Error(`User with ID ${id} not found or already restored`);
    //     };
    //     return await User.findOne({ where: { userId: id } });
    //     // return id
    // },

    toggleUser: async (id: number): Promise<User | null> => {
        const user = await User.findOne({ where: { userId: id } });
        if (!user) throw new Error(`User with ID ${id} not found`);

        const nextIsActive = !Boolean(user.isActive);

        const [activeRows] = await User.update({ isActive: nextIsActive }, { where: { userId: id } });
        if (activeRows === 0) {
            throw new Error(`User with ID ${id} not found or already deleted`);
        }
        return await User.findOne({ where: { userId: id } });
    }
}