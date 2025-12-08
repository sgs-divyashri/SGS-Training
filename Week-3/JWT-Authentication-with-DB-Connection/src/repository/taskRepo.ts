import { TaskPayload } from "../models/taskTableDefinition";
import { Task } from "../models/taskTableDefinition";
import { User } from "../models/userTableDefinition";
import { generateTaskId } from "../api/tasks/generateID";
import { Model, where } from "sequelize";
import { allowedStatuses } from "../api/tasks";

export const taskRepository = {
    createTask: async (payload: Pick<TaskPayload, "taskName" | "description" | "createdBy">): Promise<Task> => {
        const userExists = await User.findOne({ where: { userId: payload.createdBy, isActive: true } });
        if (!userExists) {
            throw new Error("Invalid createdBy userId");
        }

        const newUser = await Task.create({
            taskId: await generateTaskId(),
            ...payload,
        });

        return newUser
    },

    getAllTasks: (): Promise<Task[]> => {
        const users = Task.findAll({ where: { isActive: true } });
        return users
    },

    getSpecificTask: (id: number): Promise<Task | null> => {
        const user = Task.findOne({ where: { taskId: id, isActive: true } })
        return user
    },

    getSpecificUserTasks: async (userId: number): Promise<User | null> => {
        const user = await User.findOne({
            where: { userId: userId, isActive: true },
            include: [Task]
        });
        return user
    },

    fullUpdateTask: async (id: number, payload: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">): Promise<Task | "INVALID_STATUS" | null | undefined> => {
        const userExists = await User.findOne({
            where: { userId: payload.createdBy, isActive: true }
        });
        if (!userExists) {
            throw new Error("Invalid createdBy userId");
        }
        // Validate status
        if (!allowedStatuses.includes(payload.status!)) {
            return "INVALID_STATUS";
        }
        const [rowsUpdated, [updatedUser]] = await Task.update({ ...payload }, { where: { taskId: id, isActive: true }, returning: true })
        if (rowsUpdated === 0) {
            return null;
        }
        return updatedUser
    },

    partialUpdateTask: async (id: number, payload: Partial<TaskPayload>): Promise<TaskPayload | null> => {
        const task = await Task.findOne({ where: { taskId: id, isActive: true } });
        if (!task) return null;

        if (payload.taskName !== undefined) task.set('taskName', payload.taskName);
        if (payload.description !== undefined) task.set('description', payload.description);
        if (payload.status !== undefined) task.set('status', payload.status);
        if (payload.isActive !== undefined) task.set('isActive', payload.isActive);

        await task.save();
        return task.get();
    },

    softDeleteTask: async (id: string): Promise<string> => {
        const [affectedRows] = await Task.update({ isActive: false }, { where: { taskId: id, isActive: true } });

        if (affectedRows === 0) {
            throw new Error(`Task with ID ${id} not found or already deleted`);
        }

        return id;
    }
}