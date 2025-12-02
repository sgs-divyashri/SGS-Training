import { Model } from "sequelize";
import { taskRepository } from "../repository/taskRepo";

export interface TaskPayload {
  taskID: string;
  taskName: string;
  description: string;
  status: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export const taskServices = {
  createTask: async (payload: Partial<TaskPayload>) => {
    const user = await taskRepository.createTask(payload)
    return user
  },

  getAllTasks: async (): Promise<Model<any, any>[]> => {
    return await taskRepository.getAllTasks()
  },

  getSpecificTask: async (id: number): Promise<Model<any, any> | null> => {
    return await taskRepository.getSpecificTask(id)
  },

  getSpecificUserTasks: async (userId: number) => {
    return await taskRepository.getSpecificUserTasks(userId)
  },

  fullUpdateTask: async (id: number, payload: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">) => {
    return await taskRepository.fullUpdateTask(id, payload)
  },

  partialUpdateTask: async (id: number, payload: Partial<{taskName: string, description: string, createdBy: number, status: string}>) => {
    return await taskRepository.partialUpdateTask(id, payload)
  },

  // partialUpdateTask: (id: string, payload: Partial<Task>): Task | "INVALID_STATUS" | null => {
  //   const task = tasks.find(t => t.id === id && t.isActive);
  //   if (!task) {
  //     return null
  //   }
  //   // PARTIAL UPDATE (update only fields sent)
  //   if (payload.taskName !== undefined) task.taskName = payload.taskName;
  //   if (payload.description !== undefined) task.description = payload.description;
  //   if (payload.createdBy !== undefined) task.createdBy = payload.createdBy;
  //   // Validate status, but do NOT use h.response here
  //   if (payload.status !== undefined && !allowedStatuses.includes(payload.status)) {
  //     return "INVALID_STATUS";
  //   }
  //   if (payload.status !== undefined) task.status = payload.status;

  //   task.updatedAt = new Date().toLocaleString();

  //   return task

  // },

  softDeleteTask: async (id: string) => {
    return await taskRepository.softDeleteTask(id)
  }
};