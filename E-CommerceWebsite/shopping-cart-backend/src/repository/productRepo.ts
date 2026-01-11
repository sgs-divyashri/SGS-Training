import { Product, ProductPayload } from "../models/productTableDefinition";
import generateSimpleId from "../services/generateProductId";
import { User } from "../models/userTableDefinition";

export const productRepository = {
    createProduct: async (payload: Pick<ProductPayload, "p_name" | "p_description" | "orderedBy" | "price">): Promise<Product> => {
        const userExists = await User.findOne({ where: { userId: payload.orderedBy, isActive: true } });
        if (!userExists) {
            throw new Error("Invalid createdBy userId");
        }
        const newUser = await Product.create({ ...payload, productId: generateSimpleId()});
        return newUser
    },

    getAllProducts: (): Promise<Product[]> => {
        const products = Product.findAll();
        return products
    },

    // getSpecificUser: async (id: number): Promise<User | null> => {
    //     const user = await User.findOne({ where: { userId: id } })
    //     return user
    // },

    // fullUpdateUser: async (id: number, payload: Pick<UserPayload, "name" | "email" | "password" | "age">): Promise<User | null | undefined> => {
    //     const [rowsUpdated, [updatedUser]] = await User.update({ ...payload, password: passwordServices.hashPassword(payload.password) }, { where: { userId: id }, returning: true })
    //     if (rowsUpdated === 0) {
    //         return null;
    //     }

    //     return updatedUser
    // },

    // partialUpdateUser: async (id: number, payload: Partial<UserPayload>): Promise<UserPayload | null> => {
    //     const user = await User.findOne({ where: { userId: id, isActive: true } });
    //     if (!user) return null;

    //     if (payload.name !== undefined) user.set('name', payload.name);
    //     if (payload.email !== undefined) user.set('email', payload.email);
    //     if (payload.password !== undefined) user.set('password', passwordServices.hashPassword(payload.password));
    //     if (payload.age !== undefined) user.set('age', payload.age);

    //     await user.save();
    //     return user.get();
    // },

    // // restoreUser: async (id: number): Promise<User | null> => {
    // //     const [affectedRows] = await User.update({ isActive: true }, { where: { userId: id, isActive: false } });
    // //     if (affectedRows === 0) {
    // //         throw new Error(`User with ID ${id} not found or already restored`);
    // //     };
    // //     return await User.findOne({ where: { userId: id } });
    // //     // return id
    // // },

    // toggleUser: async (id: number): Promise<User | null> => {
    //     const user = await User.findOne({ where: { userId: id } });
    //     if (!user) throw new Error(`User with ID ${id} not found`);

    //     const nextIsActive = !Boolean(user.isActive);

    //     const [activeRows] = await User.update({ isActive: nextIsActive }, { where: { userId: id } });
    //     if (activeRows === 0) {
    //         throw new Error(`User with ID ${id} not found or already deleted`);
    //     }
    //     return await User.findOne({ where: { userId: id } });
    // }
}