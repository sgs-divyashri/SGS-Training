import { TaskPayload } from "../services/taskServices";
import { Task } from "../api/tasks/taskTableDefinition";
import { User } from "../api/users/userTableDefinition";
import { generateTaskId } from "../api/tasks/generateID";
import { Model, where } from "sequelize";
import { allowedStatuses } from "../api/tasks";

export const taskRepository = {
    createTask: async (payload: Partial<TaskPayload>) => {
        const userExists = await User.findOne({ where: { userId: payload.createdBy, isActive: true } });
        if (!userExists) {
            throw new Error("Invalid createdBy userId");
        }

        if (!payload.taskName || !payload.description) {
            throw new Error("Missing required fields");
        }

        const newUser = await Task.create({
            ...payload,
            taskId: await generateTaskId(),
            status: "To-Do",
            isActive: true
        });

        return newUser
    },

    getAllTasks: (): Promise<Model<any, any>[]> => {
        const users = Task.findAll({ where: { isActive: true } });
        return users
    },

    getSpecificTask: (id: number): Promise<Model<any, any> | null> => {
        const user = Task.findOne({ where: { taskId: id, isActive: true } })
        return user
    },

    getSpecificUserTasks: async (userId: number) => {
        const user = await User.findOne({
            where: { userId: userId, isActive: true },
            // include: [Task]
        });
        return user
    },

    fullUpdateTask: async (id: number, payload: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">) => {
        const userExists = await User.findOne({
            where: { userId: payload.createdBy, isActive: true }
        });
        if (!userExists) {
            throw new Error("Invalid createdBy userId");
        }
        // Validate status
        if (!allowedStatuses.includes(payload.status)) {
            return "INVALID_STATUS";
        }
        const [rowsUpdated, [updatedUser]] = await Task.update({ ...payload }, { where: { taskId: id, isActive: true }, returning: true })
        if (rowsUpdated === 0) {
            return null;
        }
        return updatedUser
    },

    softDeleteTask: async (id: string) => {
        const [affectedRows] = await Task.update({ isActive: false }, { where: { taskId: id, isActive: true } });

        if (affectedRows === 0) {
            throw new Error(`Task with ID ${id} not found or already deleted`);
        }

        return id;
    }
}