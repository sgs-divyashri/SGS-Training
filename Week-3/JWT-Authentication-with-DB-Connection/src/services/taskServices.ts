import { Model } from "sequelize";
import { taskRepository } from "../repository/taskRepo";
import { TaskPayload } from "../models/taskTableDefinition";
import { Task } from "../models/taskTableDefinition";
import { User } from "../models/userTableDefinition";

export const taskServices = {
  createTask: async (payload: Pick<TaskPayload, "taskName" | "description" | "createdBy">): Promise<Task> => {
    const user = await taskRepository.createTask(payload)
    return user
  },

  getAllTasks: async (): Promise<Task[]> => {
    return await taskRepository.getAllTasks()
  },

  getSpecificTask: async (id: string): Promise<Task | null> => {
    return await taskRepository.getSpecificTask(id)
  },

  getSpecificUserTasks: async (userId: number): Promise<Task[] | null> => {
    return await taskRepository.getSpecificUserTasks(userId)
  },

  fullUpdateTask: async (id: string, payload: Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">): Promise<Task | "INVALID_STATUS" | null | undefined> => {
    return await taskRepository.fullUpdateTask(id, payload)
  },

  partialUpdateTask: async (id: string, payload: Partial<{ taskName: string, description: string, createdBy: number, status: string }>): Promise<TaskPayload | null> => {
    return await taskRepository.partialUpdateTask(id, payload)
  },

  toggleTask: async (id: string): Promise<Task | null> => {
    const user = await taskRepository.toggleTask(id)
    return user
  },
};