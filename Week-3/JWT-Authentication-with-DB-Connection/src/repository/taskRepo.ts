import { TaskPayload } from "../models/taskTableDefinition";
import { Task } from "../models/taskTableDefinition";
import { User } from "../models/userTableDefinition";
import { generateTaskId } from "../api/tasks/generateID";
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

    getSpecificTask: (id: string): Promise<Task | null> => {
        const user = Task.findOne({ where: { taskId: id, isActive: true } })
        return user
    },

    getSpecificUserTasks: async (userId: number): Promise<Task[] | null> => {
        if (!Number.isFinite(userId) || userId <= 0) return [];
        const tasks = await Task.findAll({
            where: { createdBy: userId }, // createdBy should be the FK to User.userId
            order: [["createdAt", "DESC"]],
        });
        return tasks;
    },

    fullUpdateTask: async (id: string, userId: number, payload: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">): Promise<Task | "INVALID_STATUS" | null | undefined> => {
        const userExists = await User.findOne({
            where: { userId: userId, isActive: true }
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

    partialUpdateTask: async (id: string, payload: Partial<TaskPayload>): Promise<TaskPayload | null> => {
        const task = await Task.findOne({ where: { taskId: id, isActive: true } });
        if (!task) return null;

        if (payload.taskName !== undefined) task.set('taskName', payload.taskName);
        if (payload.description !== undefined) task.set('description', payload.description);
        if (payload.status !== undefined) task.set('status', payload.status);
        if (payload.isActive !== undefined) task.set('isActive', payload.isActive);

        await task.save();
        return task.get();
    },

    toggleTask: async (id: string): Promise<Task | null> => {
        const task = await Task.findOne({ where: { taskId: id } });
        if (!task) throw new Error(`User with ID ${id} not found`);

        const nextIsActive = !Boolean(task.isActive);

        const [activeRows] = await Task.update({ isActive: nextIsActive }, { where: { taskId: id } });
        if (activeRows === 0) {
            throw new Error(`User with ID ${id} not found or already deleted`);
        }
        return await Task.findOne({ where: { taskId: id } });
    }
}