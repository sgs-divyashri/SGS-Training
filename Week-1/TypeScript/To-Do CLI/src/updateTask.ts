import { getCurrentDateTime } from "./utils";
import { tasks, allowedStatuses } from "./data";

export async function updateTask(id: string, newName: string, newDesc: string, statusChoice: string) {
    if (tasks.length === 0) {
        console.log("\nNo tasks available to update.");
        return;
    }

    const task = tasks.find((t) => t.ID === id)!; // non-null assertion operator

    console.table([task]);

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

