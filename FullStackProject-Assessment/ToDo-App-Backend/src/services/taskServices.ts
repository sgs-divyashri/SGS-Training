import { TaskPayload, Task } from "../models/taskTableDefinition";
import { taskRepository } from "../repository/taskRepository";

export const taskServices = {
  createTask: async (
    payload: Pick<TaskPayload, "taskName" | "description" | "assignedTo">,
  ): Promise<Task> => {
    return await taskRepository.createTask(payload);
  },

  updateTaskStatus: async (
    taskID: string,
    payload: Pick<TaskPayload, "status">,
  ): Promise<TaskPayload | null> => {
    return await taskRepository.updateTaskStatus(taskID, payload);
  },

  getAllTasks: async (): Promise<Task[]> => {
    const tasks = await taskRepository.getAllTasks();
    return tasks;
  },

  getSpecificUserTasks: async (userId: string): Promise<Task[] | null> => {
    return await taskRepository.getSpecificUserTasks(userId)
  },

  editTask: async (id: string, payload: Pick<Partial<TaskPayload>, "taskName" | "description" | "assignedTo">): Promise<TaskPayload | null> => {
    return await taskRepository.editTask(id, payload)
  },

  toggleTask: async (id: string): Promise<Task | null> => {
    const task = await taskRepository.toggleTask(id)
    return task
  },
};
