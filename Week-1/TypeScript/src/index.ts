import { askQuestion } from "./utils";
import { createTask } from "./createTask";
import { updateTask } from "./updateTask";
import { getAllTasks } from "./getAllTasks";
import { getSpecificTask } from "./getSpecificTask";
import { deleteTask } from "./deleteTask";
import { activeToInactive } from "./activeToInactive";
import { exitApp } from "./exitApp";

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
            case 1: await createTask(); 
                    break;
            case 2: await updateTask(); 
                    break;
            case 3: await getAllTasks(); 
                    break;
            case 4: await getSpecificTask(); 
                    break;
            case 5: await deleteTask(); 
                    break;
            case 6: await activeToInactive(); 
                    break;
            case 7: exitApp(); 
                    return;
            default: console.log("Invalid option!");
        }
    } while (option !== "7");
}

main();
