import { tasks } from "./data";

export async function getSpecificTask(id: string) {
    if (tasks.length === 0) {
        console.log("\nNo tasks available.");
        return;
    }

    const task = tasks.find((t) => t.ID === id && t.isActive);

    if (!task) {
        console.log(`Task '${id}' not found.`);
        return;
    }

    console.table([task]);
}
