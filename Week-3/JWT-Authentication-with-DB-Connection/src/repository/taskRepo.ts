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

        const newTask= await Task.create({
            taskId: await generateTaskId(),
            ...payload,
        });

        return newTask
    },

    getAllTasks: (): Promise<Task[]> => {
        const tasks = Task.findAll({ where: { isActive: true } });
        return tasks
    },

    getSpecificTask: (id: string): Promise<Task | null> => {
        const task = Task.findOne({ where: { taskId: id, isActive: true } })
        return task
    },

    getSpecificUserTasks: async (userId: number): Promise<Task[] | null> => {
        if (!Number.isFinite(userId) || userId <= 0) return [];
        const tasks = await Task.findAll({
            where: { createdBy: userId }, 
            order: [["createdAt", "DESC"]],
        });
        return tasks;
    },

    fullUpdateTask: async (id: string, payload: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">): Promise<Task | "INVALID_STATUS" | null | undefined> => {
        if (!allowedStatuses.includes(payload.status!)) {
            return "INVALID_STATUS";
        }
        const [rowsUpdated, [updatedTask]] = await Task.update({ ...payload }, { where: { taskId: id }, returning: true })
        if (rowsUpdated === 0) {
            return null;
        }
        return updatedTask
    },

    partialUpdateTask: async (id: string, payload: Pick<Partial<TaskPayload>, "taskName" | "description" | "status" | "createdBy">): Promise<TaskPayload | null> => {
        const task = await Task.findOne({ where: { taskId: id } });
        if (!task) return null;

        if (payload.taskName !== undefined) task.set('taskName', payload.taskName);
        if (payload.description !== undefined) task.set('description', payload.description);
        if (payload.status !== undefined) task.set('status', payload.status);
        if (payload.createdBy !== undefined) task.set('createdBy', payload.createdBy);

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