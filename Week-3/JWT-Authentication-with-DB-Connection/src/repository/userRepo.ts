import { UserPayload, userServices } from "../services/userServices";
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
        const user = User.findOne({ where: { userId: id, isActive: true } })
        return user
    },

    fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">) => {
        const [rowsUpdated, [updatedUser]] = await User.update({ ...payload, password: hashPassword(payload.password) }, { where: { userId: id, isActive: true }, returning: true })
        if (rowsUpdated === 0) {
            return null;  // service should not return an Hapi response
        }

        return updatedUser
    },


    partialUpdateUser: async (id: number, payload: Partial<UserPayload>) => {
        const user = await User.findOne({ where: { userId: id, isActive: true } });
        if (!user) return null;

        if (payload.name !== undefined) user.set('name', payload.name);
        if (payload.email !== undefined) user.set('email', payload.email);
        if (payload.password !== undefined) user.set('password', hashPassword(payload.password));
        if (payload.age !== undefined) user.set('age', payload.age);

        await user.save();
        return user.get();
    },
    // partialUpdateUser: async (id: number, payload: Partial<UserPayload>) => {
    //     const user = User.findOne({where: {userId: id, isActive: true}})
    //     if (!user) return null

    //     // const user = users.find(t => t.id === id && t.isActive);
    //     // if (!user) {
    //     //     return null
    //     // }

    //     // PARTIAL UPDATE (update only fields sent)
    //     if (payload.name !== undefined)  = payload.name;
    //     if (payload.email !== undefined) user.email = payload.email;
    //     if (payload.password !== undefined) user.password = hashPassword(payload.password);
    //     if (payload.age !== undefined) user.age = payload.age;

    //     // user.updatedAt = new Date().toLocaleString();

    //     return user
    //     // const userExists = await userServices.findByEmail(payload.email!)

    //     // if (payload.password) {
    //     //     payload.password = hashPassword(payload.password);
    //     // }

    //     const [rowsUpdated, updatedUsers] = await User.update(payload, {
    //         where: { userId: id, isActive: true },
    //         returning: true,
    //     });

    //     []

    //     console.log("rows updated: ", rowsUpdated)
    //     if (rowsUpdated > 0) {
    //         return updatedUsers ? updatedUsers[0] : await User.findOne({ where: { userId: id } });
    //     }

    //     return null;

    // },

    softDeleteUser: async (id: number) => {
        const [affectedRows] = await User.update({ isActive: false }, { where: { userId: id, isActive: true } });
        if (affectedRows === 0) {
            throw new Error(`User with ID ${id} not found or already deleted`);
        }
        return id;
    }
}