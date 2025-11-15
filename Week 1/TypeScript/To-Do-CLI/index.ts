import {createTask} from "./createTask";
export askQuestion, getCurrentDateTime;

import * as readline from 'readline';

// Define the Task interface for strong typing
// to define a blueprint or structure for objects.
// It describes what properties a “Task” object must have and what type each property is.
interface Task {
    ID: string;
    TaskName: string;
    Description: string;
    Status: string;
    CreatedAt: string;
    UpdatedAt: string;
    isActive: boolean; //
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
const tasks: Task[] = []; // initialize in-memory array to store all the tasks as objects

let option: string;  // user's choice for menu items
const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];    // allowed option for status
const t_id = await askQuestion(rl, "Enter the task ID: ");

// Strongly type functions
function getCurrentDateTime(): string {
    return new Date().toLocaleString();   // returns current date and time from your system clock
}  // toLocaleString() - converts the Date object into a human-readable string, according to your computer’s locale (language + region settings), both date and time parts.















// Driver function of the application
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

        switch (Number(option)) { // enter only numbers as input
            case 1:
                await createTask(t_name, t_desc);
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
            case 6: await activeToInactive();
            case 7:
                exitApp();
                return;
            default:
                console.log("Invalid option! Please choose between 1–6.");
        }
    } while (option !== "6");  // executes until option == 6
}

main(); // calls the main() - driver function



// task?.isActive - getting error above if stmt, not error in if stamt


// functions parameterized
// get input and pass into func 
// type 
// new project for typescript

