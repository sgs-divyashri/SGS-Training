import { askQuestion, getCurrentDateTime } from "./utils";
import { tasks, allowedStatuses } from "./data";


export async function updateTask() {
    if (tasks.length === 0) {
        console.log("\nNo tasks available to update.");
        return;
    }

    console.table(tasks.filter(t => t.isActive));

    const id = await askQuestion("\nEnter Task ID to update: ");

    const task = tasks.find((t) => t.ID === id && t.isActive);

    if (!task) {
        console.log("Task not found or inactive.");
        return;
    }

    console.table([task]);

    const newName = await askQuestion("New name (Enter to skip): ");
    const newDesc = await askQuestion("New description (Enter to skip): ");

    console.log("\nStatuses:");
    allowedStatuses.forEach((status, i) =>
        console.log(`${i + 1}. ${status}`)
    );

    const statusChoice = await askQuestion("Choose (1–4) or Enter to skip: ");

    if (newName) task.TaskName = newName;
    if (newDesc) task.Description = newDesc;

    if (statusChoice) {
        const index = Number(statusChoice) - 1;
        if (allowedStatuses[index]) {
            task.Status = allowedStatuses[index];
        }
    }

    task.UpdatedAt = getCurrentDateTime();

    console.log("\nTask updated!");
    console.table([task]);
}
