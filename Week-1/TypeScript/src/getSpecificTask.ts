import { askQuestion } from "./utils";
import { tasks } from "./data";

export async function getSpecificTask() {
    if (tasks.length === 0) {
        console.log("\nNo tasks available.");
        return;
    }

    console.table(tasks);

    const id = await askQuestion("Enter Task ID: ");
    const task = tasks.find((t) => t.ID === id);

    if (!task) {
        console.log(`Task '${id}' not found.`);
        return;
    }

    console.table([task]);
}
