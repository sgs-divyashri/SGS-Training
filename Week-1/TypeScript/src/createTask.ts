import { tasks } from "./data";
import { Task } from "./types";
import { askQuestion, getCurrentDateTime } from "./utils";
import { generateTaskId } from "./generateTaskId";

export async function createTask() {
    const taskId = generateTaskId();
    const status = "To-Do";

    console.log(`\nCreating new task...`);
    console.log(`Task ID: ${taskId}`);

    const name = await askQuestion("Enter task name: ");
    const desc = await askQuestion("Enter task description: ");

    const timestamp = getCurrentDateTime();

    const newTask: Task = {
        ID: taskId,
        TaskName: name,
        Description: desc,
        Status: status,
        CreatedAt: timestamp,
        UpdatedAt: timestamp,
        isActive: true
    };

    tasks.push(newTask);

    console.log("\nTask created successfully!");
    console.table([newTask]);
}
