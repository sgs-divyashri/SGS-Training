import { askQuestion } from "./utils";
import { tasks } from "./data";

export async function activeToInactive() {
    const id = await askQuestion("Enter Task ID to deactivate: ");

    const task = tasks.find((t) => t.ID === id && t.isActive);

    if (!task) {
        console.log("Task not found or already inactive.");
        return;
    }

    task.isActive = false;

    console.log(`Task ${id} set to inactive.`);
}
