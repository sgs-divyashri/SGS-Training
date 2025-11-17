import { tasks } from "./data";
import { Task } from "./types";
import { getCurrentDateTime } from "./utils";
import { generateTaskId } from "./generateTaskId";

let taskCounter = 1;

export async function createTask(t_name: string, desc: string) {
    
    const taskId = generateTaskId(taskCounter);
    const status = "To-Do";

    console.log(`\nCreating new task...`);
    console.log(`Task ID: ${taskId}`);

    const timestamp = getCurrentDateTime();

    const newTask: Task = {
        ID: taskId,
        TaskName: t_name,
        Description: desc,
        Status: status,
        CreatedAt: timestamp,
        UpdatedAt: timestamp,
        isActive: true
    };

    tasks.push(newTask);

    taskCounter++;

    console.log("\nTask created successfully!");
    console.table([newTask]);
}

