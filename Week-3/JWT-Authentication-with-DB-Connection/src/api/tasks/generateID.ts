import { Task } from "../../models/taskTableDefinition";

export async function generateTaskId(): Promise<string> {
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



