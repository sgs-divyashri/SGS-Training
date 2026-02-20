import { Task, TaskPayload } from "../models/taskTableDefinition";
import { User } from "../models/userTableDefinition";
import { v4 as uuid } from "uuid";

export const taskRepository = {
  createTask: async (
    payload: Pick<TaskPayload, "taskName" | "description" | "assignedTo">,
  ): Promise<Task> => {
    const newTask = await Task.create({
      taskId: uuid(),
      ...payload,
    });

    return newTask;
  },

  updateTaskStatus: async (
    taskID: string,
    payload: Pick<TaskPayload, "status">,
  ): Promise<TaskPayload | null> => {
    const task = await Task.findOne({ where: { taskId: taskID } });
    if (!task) return null;

    if (payload.status !== undefined) task.set("status", payload.status);

    await task.save();
    return task.get();
  },

  getAllTasks: (): Promise<Task[]> => {
    const tasks = Task.findAll({
      include: [
        {
          model: User,
          attributes: ["email", "name", "userId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return tasks;
  },

  getSpecificUserTasks: async (userId: string): Promise<Task[] | null> => {
    if (!userId) return [];
    const tasks = await Task.findAll({
      where: { assignedTo: userId },
      order: [["createdAt", "DESC"]],
    });
    return tasks;
  },

  editTask: async (id: string, payload: Pick<Partial<TaskPayload>, "taskName" | "description" | "assignedTo">): Promise<TaskPayload | null> => {
    const task = await Task.findOne({ where: { taskId: id } });
    if (!task) return null;

    if (payload.taskName !== undefined) task.set('taskName', payload.taskName);
    if (payload.description !== undefined) task.set('description', payload.description);
    if (payload.assignedTo !== undefined) {
      const user = await User.findOne({
        where: {
          email: payload.assignedTo,
        },
        attributes: ["userId"],
      });

      if (!user) {
        throw new Error("Assignee not found");
      }

      task.set("assignedTo", user.userId);
    }
    await task.save();
    return task.get();
  },

  toggleTask: async (id: string): Promise<Task | null> => {
    const task = await Task.findOne({ where: { taskId: id } });
    if (!task) throw new Error(`Task with ID ${id} not found`);

    const nextIsActive = !Boolean(task.isActive);


    const [affected, rows] = await Task.update(
      { isActive: nextIsActive },
      { where: { taskId: id }, returning: true }
    );

    if (affected === 0) {
      throw new Error(`Task with ID ${id} not found or update failed`);
    }

    return await Task.findOne({ where: { taskId: id } });
  }
};
