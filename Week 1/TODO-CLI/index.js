import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
}

const tasks = []
var taskCounter = 1;
let option;
const allowedStatuses = ["To-Do", "In Progress", "Review", "Completed"];

function getCurrentDateTime() {
    return new Date().toLocaleString(); 
}

function generateTaskId() {
    const prefix = "T";
    const minDigits = 3;
    const digits = Math.max(String(taskCounter).length, minDigits);

    // create ID based on current counter
    const taskId = prefix + String(taskCounter).padStart(digits, "0");

    taskCounter++; // increment for next task
    return taskId;
}

async function createTask() {
    const taskId = generateTaskId();
    const status = "To-Do"
    console.log(`\nCreating new task...`);
    console.log(`Task ID: ${taskId} (auto-generated)\n`);

    const t_name = await askQuestion(rl, "Enter the task name: ");
    const t_desc = await askQuestion(rl, "Enter the task description: ");
    const createdAt = getCurrentDateTime();
    const updatedAt = createdAt;
    tasks.push({ ID: taskId, TaskName: t_name, Description: t_desc, Status: status, CreatedAt: createdAt, UpdatedAt: updatedAt })
    console.log("\nTask created successfully!");
    console.table([tasks[tasks.length - 1]]);
}

async function getAllTasks() {
    if (tasks.length === 0) {
        console.log("No Tasks found..")
    }
    else {
        console.log("All Tasks..")
        console.table(tasks)
    }
}

async function updateTask() {
    if (tasks.length === 0) {
    console.log("\nNo tasks available to update.");
    return;
    }
    
    console.table(tasks);
    const t_id = await askQuestion(rl, "\nEnter the Task ID to update: ");

    // find the task
    const task = tasks.find(t => t.ID === t_id);

    if (!task) {
        console.log(`Task ID '${t_id}' not found.`);
        return;
    }

    console.log(`\nCurrent Task Details for ${t_id}:`);
    console.table([task]);

    const newName = await askQuestion(rl, "Enter new Task Name (press Enter to skip): ");
    const newDesc = await askQuestion(rl, "Enter new Description (press Enter to skip): ");
    console.log("\nSelect new Status (press Enter to skip):");
    allowedStatuses.forEach((status, index) => console.log(`${index + 1}. ${status}`));

    const statusChoice = await askQuestion(rl, "Choose status (1–4) or press Enter to keep existing: ");
    if (newName) task.TaskName = newName;
    if (newDesc) task.Description = newDesc;

    if (statusChoice) {
        const statusIndex = Number(statusChoice) - 1;
        if (statusIndex >= 0 && statusIndex < allowedStatuses.length) {
            task.Status = allowedStatuses[statusIndex];
        } else {
            console.log("Invalid status choice. Keeping previous status.");
        }
    }

    task.UpdatedAt = getCurrentDateTime();

    console.log("\nTask updated successfully!");
    console.table([task]);
}

async function getSpecificTask() {
    if (tasks.length === 0) {
        console.log("\nNo tasks available.");
        return;
    }

    console.table(tasks);
    const t_id = await askQuestion(rl, "Enter the Task ID to view: ");

    // Use .find() to get the task object directly
    const task = tasks.find(task => task.ID === t_id);

    if (task) {
        console.log(`\nTask Details for ID ${t_id}:`);
        console.table([tasks[tasks.length - 1]]);
    } else {
        console.log(`Task ID '${t_id}' not found.\n`);
    }
}

async function deleteTask() {
    console.log("\nCurrent Tasks:");
    console.table(tasks)
    const t_id = await askQuestion(rl, "Enter the task ID: ");
    const index = tasks.findIndex(task => task.ID === t_id);
    if (index !== -1) {
        // Remove that task from the array
        const deletedTask = tasks.splice(index, 1);
        console.log(`Task ${deletedTask[0].ID} deleted successfully.`);
    } else {
        console.log(`Task ID '${t_id}' not found.`);
    }
}

// Exit function
function exitApp() {
    console.log("Exiting the application...");
    rl.close(); // closes the readline interface
    process.exit(0); // exits the Node.js process
}

async function main() {
    do {
        console.log("TO-DO Application");
        console.log("\n");

        console.log("Menu");
        console.log("1. Create a Task");
        console.log("2. Update a Task");
        console.log("3. Get all Tasks");
        console.log("4. Get a task by ID");
        console.log("5. Delete a task");
        console.log("6. Exit");
        console.log("\n");

        option = await askQuestion(rl, "Please enter your option: ");

        switch (Number(option)) {
            case 1: await createTask();
                    break;
            case 2: await updateTask();
                    break;
            case 3: await getAllTasks();
                    break;
            case 4: await getSpecificTask();
                    break;
            case 5: await deleteTask()
                    break;
            case 6: exitApp(); // Call the exit function
                    return;
            default: console.log("Invalid option! Please choose between 1–6.");
        }
    } while (option != 6)
}

main()

