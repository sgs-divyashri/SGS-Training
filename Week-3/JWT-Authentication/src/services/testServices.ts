import { Test } from "../api/test/testdb";
import { Model, where } from "sequelize";

export interface UserPayload {
    id: number,
    name: string;
}

export const testServices = {
    insertData: (name: string): Promise<Model<any, any>> => {
        const user = Test.create({ name });
        return user
    },

    getAllData: (): Promise<Model<any, any>[]> => {
        const users = Test.findAll();
        return users
    },

    getSpecificData: (id: number): Promise<Model<any, any> | null> => {
        const user = Test.findByPk(id)
        return user
    },

    fullUpdateData: (id: number, payload: UserPayload): Promise<Model<any, any> | null> => {
        Test.update({...payload}, {where: {id}})
        const update_record = Test.findByPk(id)
        return update_record
    }
}