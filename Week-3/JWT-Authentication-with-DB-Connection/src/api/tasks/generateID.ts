import { Task } from "./taskTableDefinition";
import { Model } from "sequelize";

let taskCounter: number = 1;

export async function generateTaskId(): Promise<string | undefined> {
    const lastTask = await Task.findOne({ order: [['createdAt', 'DESC']] });
    if (lastTask === null) {
        return 'T001'
    }
    const taskData = lastTask!.toJSON();
    const lastId = parseInt(taskData.taskId.replace('T', ''));
    const nextId = lastId + 1;
    const taskId = `T${String(nextId).padStart(3, '0')}`
    return taskId;
}



