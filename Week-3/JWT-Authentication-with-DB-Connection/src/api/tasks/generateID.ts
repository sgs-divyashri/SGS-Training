import { Task } from "./taskTableDefinition";
import { Model } from "sequelize";

export async function generateTaskId(): Promise<string> {
    const lastTask = await Task.findOne({ order: [['createdAt', 'DESC']] });
    if (lastTask === null) {
        throw new Error("No last tasks found!");
    }
    else {
        const taskData = lastTask.toJSON();
        const lastId = parseInt(taskData.taskId.replace('T', ''));

        // const lastId = lastTask ? parseInt(lastTask.taskId.replace('T', '')) : 0;
        const nextId = lastId + 1;
        const taskId = `T${String(nextId).padStart(3, '0')}`
        return taskId;
    }
}


