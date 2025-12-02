import { askQuestion } from "./utils";
import { createTask } from "./createTask";
import { updateTask } from "./updateTask";
import { getAllTasks } from "./getAllTasks";
import { getSpecificTask } from "./getSpecificTask";
import { deleteTask } from "./deleteTask";
import { activeToInactive } from "./activeToInactive";
import { exitApp } from "./exitApp";
import { allowedStatuses, tasks } from "./data";

async function main() {
    let option = "";

    do {
        console.log("\n--- TO-DO APPLICATION ---");
        console.log("1. Create a Task");
        console.log("2. Update a Task");
        console.log("3. Get All Tasks");
        console.log("4. Get Task by ID");
        console.log("5. Delete Task");
        console.log("6. Set Task Inactive");
        console.log("7. Exit\n");

        option = await askQuestion("Choose an option: ");

        switch (Number(option)) {
            case 1: const t_name = await askQuestion("Enter task name: ");
                    const desc = await askQuestion("Enter task description: ");
                    await createTask(t_name, desc); 
                    break;

            case 2: console.table(tasks.filter((t) => t.isActive));
                    const id = await askQuestion("\nEnter Task ID to update: ");
                    const index = tasks.findIndex(t => t.ID === id && t.isActive);
                    if (index === -1) {
                        console.log("\n Invalid Task ID or inactive task.");
                        break;   
                    }
                    const newName = await askQuestion("Enter new Task Name (press Enter to skip): ");
                    const newDesc = await askQuestion("Enter new description (Enter to skip): ");
                    console.log("\nSelect new Status (press Enter to skip):");
                    allowedStatuses.forEach((status, index) => console.log(`${index + 1}. ${status}`));
                    const statusChoice = await askQuestion("Choose status (1–4) or press Enter to keep existing: "); 
                    await updateTask(id, newName, newDesc, statusChoice);
                    break;

            case 3: await getAllTasks(); 
                    break;

            case 4: console.table(tasks.filter((t) => t.isActive));
                    const id_text = await askQuestion("Enter Task ID: ");
                    await getSpecificTask(id_text); 
                    break;

            case 5: console.table(tasks);
                    const idText = await askQuestion("Enter Task ID to delete: ");
                    await deleteTask(idText); 
                    break;

            case 6: console.table(tasks.filter((t) => t.isActive));
                    const ID = await askQuestion("Enter Task ID to deactivate: ");
                    await activeToInactive(ID);
                    break;

            case 7: exitApp(); 
                    return;

            default: console.log("Invalid option!");
        }
    } while (option !== "7");
}

main();
