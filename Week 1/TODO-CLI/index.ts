import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(rl: String, question: Number) {
    return new Promise((resolve) => {
        rl.question(question, (answer: Number) => resolve(answer));
    });
}

const tasks: any = []
var taskCounter = 1;
let option;


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
    tasks.push({ ID: taskId, TaskName: t_name, Description: t_desc, Status: status })
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

async function deleteTask() {
    console.log("\nCurrent Tasks:", tasks);
    const t_id = await askQuestion(rl, "Enter the task ID: ");
    const index = tasks.findIndex(x => x.taskId === t_id);
    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1);
        console.log(`Task ${deletedTask[0].taskId} deleted successfully.`);
    } else {
        console.log(`Task ID '${t_id}' not found.`);
    }
    console.log("Task Deleted")
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
            case 2: console.log("Update a Task");
                break;
            case 3: await getAllTasks();
                break;
            case 4: console.log("Get a Task by ID");
                break;
            case 5: await deleteTask()
                break;
            case 6: exitApp(); // Call the exit function
                return;
            default: console.log("Invalid option! Please choose between 1–6.");
        }

        // rl.close();

    } while (option != 6)
}

main()

