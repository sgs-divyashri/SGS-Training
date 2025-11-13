import * as readline from 'readline';

// Define the Task interface for strong typing
interface Task {
    ID: string;
    TaskName: string;
    Description: string;
    Status: string;
    CreatedAt: string;
    UpdatedAt: string;
}

// Type for readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Strongly type the askQuestion function
async function askQuestion(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer: string) => resolve(answer));
    });
}

// Declare variables with types
const tasks: Task[] = [];
let taskCounter: number = 1;
let option: string;
const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];

// Strongly type functions
function getCurrentDateTime(): string {
    return new Date().toLocaleString();
}

function generateTaskId(): string {
    const prefix = "T";
    const minDigits = 3;
    const digits = Math.max(String(taskCounter).length, minDigits);

    const taskId = prefix + String(taskCounter).padStart(digits, "0");
    taskCounter++;
    return taskId;
}

async function createTask(){
    const taskId = generateTaskId();
    const status = "To-Do";
    console.log(`\nCreating new task...`);
    console.log(`Task ID: ${taskId} (auto-generated)\n`);

    const t_name = await askQuestion(rl, "Enter the task name: ");
    const t_desc = await askQuestion(rl, "Enter the task description: ");
    const createdAt = getCurrentDateTime();
    const updatedAt = createdAt;

    const newTask: Task = {
        ID: taskId,
        TaskName: t_name,
        Description: t_desc,
        Status: status,
        CreatedAt: createdAt,
        UpdatedAt: updatedAt,
    };

    tasks.push(newTask);
    console.log("\nTask created successfully!");
    console.table([newTask]);
}

async function getAllTasks(){
    if (tasks.length === 0) {
        console.log("No Tasks found..");
    } else {
        console.log("All Tasks..");
        console.table(tasks);
    }
}

async function updateTask() {
    if (tasks.length === 0) {
        console.log("\nNo tasks available to update.");
        return;
    }

    console.table(tasks);
    const t_id = await askQuestion(rl, "\nEnter the Task ID to update: ");
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
            task.Status = allowedStatuses[statusIndex] ?? task.Status;
            // task.Status = allowedStatuses[statusIndex];
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
    const task = tasks.find(task => task.ID === t_id);

    if (task) {
        console.log(`\nTask Details for ID ${t_id}:`);
        console.table([task]);
    } else {
        console.log(`Task ID '${t_id}' not found.\n`);
    }
}

async function deleteTask() {
    if (tasks.length === 0) {
        console.log("No tasks to delete.");
        return;
    }

    console.log("\nCurrent Tasks:");
    console.table(tasks);

    const t_id = await askQuestion(rl, "Enter the task ID: ");
    const index = tasks.findIndex(task => task.ID === t_id);

    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1);
        console.log(`Task ${deletedTask[0]?.ID ?? 'Unknown'} deleted successfully.`);
    } else {
        console.log(`Task ID '${t_id}' not found.`);
    }
}

function exitApp(): void {
    console.log("Exiting the application...");
    rl.close();
    process.exit(0);
}

async function main() {
    do {
        console.log("TO-DO Application\n");
        console.log("Menu");
        console.log("1. Create a Task");
        console.log("2. Update a Task");
        console.log("3. Get all Tasks");
        console.log("4. Get a task by ID");
        console.log("5. Delete a task");
        console.log("6. Exit\n");

        option = await askQuestion(rl, "Please enter your option: ");

        switch (Number(option)) {
            case 1:
                await createTask();
                break;
            case 2:
                await updateTask();
                break;
            case 3:
                await getAllTasks();
                break;
            case 4:
                await getSpecificTask();
                break;
            case 5:
                await deleteTask();
                break;
            case 6:
                exitApp();
                return;
            default:
                console.log("Invalid option! Please choose between 1–6.");
        }
    } while (option !== "6");
}

main();
