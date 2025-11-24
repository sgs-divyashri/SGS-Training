import { generateTaskId } from "../api/tasks/generateID";
import { allowedStatuses } from "../api/tasks";
export interface Task {
  id?: string;
  taskName: string;
  description: string;
  status?: string;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}


export const tasks: Task[] = [];

export const taskServices = {
  createTask: (task: Task): Task => {
    const newTask: Task = {
      id: generateTaskId(),
      taskName: task.taskName,
      description: task.description,
      status: "To-Do",
      createdBy: task.createdBy,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      isActive: true
    }

    tasks.push(newTask);
    return newTask;
  },

  getAllTasks: (): Task[] => {
    return tasks.filter((task) => task.isActive === true)
  },

  getSpecificTask: (id: string): Task | undefined => {
    return tasks.find(t => t.id === id && t.isActive === true);
  },

  getSpecificUserTasks: (userId: number): Task[] => {
    return tasks.filter(t => t.createdBy === userId && t.isActive === true);
  },

  fullUpdateTask: (id: string, payload: Task): Task | "MISSING_FIELDS" | "INVALID_STATUS" | null => {
    const task = tasks.find(t => t.id === id && t.isActive);
    if (!task) {
      return null
    }

    // Validate: all fields must be present
    if (!payload.taskName || !payload.description || !payload.status || !payload.createdBy) {
      return "MISSING_FIELDS";
    }

    // Validate status
    if (!allowedStatuses.includes(payload.status)) {
      return "INVALID_STATUS";
    }

    // FULL UPDATE
    task.taskName = payload.taskName;
    task.description = payload.description;
    task.status = payload.status;

    task.updatedAt = new Date().toLocaleString();

    return task

  },

  partialUpdateTask: (id: string, payload: Partial<Task>): Task | "INVALID_STATUS" | null => {
    const task = tasks.find(t => t.id === id && t.isActive);
    if (!task) {
      return null
    }
    // PARTIAL UPDATE (update only fields sent)
    if (payload.taskName !== undefined) task.taskName = payload.taskName;
    if (payload.description !== undefined) task.description = payload.description;
    if (payload.createdBy !== undefined) task.createdBy = payload.createdBy;
    // Validate status, but do NOT use h.response here
    if (payload.status !== undefined && !allowedStatuses.includes(payload.status)) {
      return "INVALID_STATUS";
    }
    if (payload.status !== undefined) task.status = payload.status;

    task.updatedAt = new Date().toLocaleString();

    return task

  },

  softDeleteTask: (id: string): Task | null => {
    const task = tasks.find((t) => t.id === id && t.isActive === true)
    if (!task) {
      return null;
    }
    task.isActive = false
    task.updatedAt = new Date().toLocaleString();
    return task
  }
};