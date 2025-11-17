import { askQuestion } from "./utils";
import { tasks } from "./data";

export async function deleteTask() {
    console.table(tasks);

    const id = await askQuestion("Enter Task ID to delete: ");

    const index = tasks.findIndex((t) => t.ID === id);

    if (index === -1) {
        console.log("Task not found.");
        return;
    }

    const deleted = tasks.splice(index, 1);

    console.log(`Deleted Task: ${deleted[0].ID}`);
}
    