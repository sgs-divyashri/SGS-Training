import { tasks } from "./data";

export async function getAllTasks() {
    if (tasks.length === 0) {
        console.log("\nNo tasks found.");
        return;
    }

    console.log("\nActive Tasks:");
    console.table(tasks.filter((t) => t.isActive));
}
