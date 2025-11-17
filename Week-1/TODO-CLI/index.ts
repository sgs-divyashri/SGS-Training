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
let taskCounter: number = 1;  // task id shld start from 1
let option: string;  // user's choice for menu items
const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];    // allowed option for status

// Strongly type functions
function getCurrentDateTime(): string {
    return new Date().toLocaleString();   // returns current date and time from your system clock
}  // toLocaleString() - converts the Date object into a human-readable string, according to your computer’s locale (language + region settings), both date and time parts.


function generateTaskId(): string {    // String dt
    const prefix = "T";   // First letter in string is T
    const minDigits = 3;  // holds the minimum number of digits
    // The String() function converts any value into a string (text).
    // .length property gives the number of characters in a string.
    // Math.max() is a built-in JavaScript function that returns the larger of the two numbers given.
    // Take whichever is larger — the actual number of digits in taskCounter, or the minimum number of digits required — and store it in digits.
    const digits = Math.max(String(taskCounter).length, minDigits);

    // create ID based on current counter
    // The String() function converts the number into a string, so that string methods (like .padStart()) can be used.
    // padStart(targetLength, padString)
    // Adds characters to the start (left side) of a string until it reaches the desired length.
    // targetLength: how long the final string should be.
    // padString: what character(s) to fill in from the start (usually "0" for numbers)
    // If the string is already longer than the targetLength, it remains unchanged
    const taskId = prefix + String(taskCounter).padStart(digits, "0");
    taskCounter++; // increment for next task
    return taskId;  // return the task Id
}

async function createTask() {
    const taskId = generateTaskId();   // call generateTaskId()
    const status = "To-Do";  // default status
    console.log(`\nCreating new task...`);
    console.log(`Task ID: ${taskId} (auto-generated)\n`);

    // Await - await pauses the execution of the current async function until the Promise resolves.
    const t_name = await askQuestion(rl, "Enter the task name: "); // asks the question and waits for the user’s input.
    const t_desc = await askQuestion(rl, "Enter the task description: ");
    const createdAt = getCurrentDateTime();  // calls getCurrentDateTime()
    const updatedAt = createdAt;  // initially assigning createdAt value into updatedAt variable

    // new Task object using the Task interface
    const newTask: Task = {
        ID: taskId,
        TaskName: t_name,
        Description: t_desc,
        Status: status,
        CreatedAt: createdAt,
        UpdatedAt: updatedAt,
        isActive: true,
    };

    tasks.push(newTask);   // push task objects into tasks[]
    console.log("\nTask created successfully!");
    console.table([newTask]); // display only the task object as array in table format
}

async function getAllTasks() {
    if (tasks.length === 0) {
        console.log("No Tasks found..");
    } else {
        console.log("All Tasks..");
        // forEach(index => tasks.isActive === true)
        // if(taisActive == true)
        console.table(tasks.filter((task) => task.isActive === true))
        // console.table(tasks);   // display all the tasks in table format
    }
}

async function updateTask() {
    if (tasks.length === 0) {
        console.log("\nNo tasks available to update.");
        return;
    }

    console.table(tasks);
    const t_id = await askQuestion(rl, "\nEnter the Task ID to update: ");

    // find the task with task ID
    // t_id → is a variable that holds the ID of the task you want to search for
    // Array.prototype.find() - JS array method used to find the first element in an array that satisfies a given condition (predicate function).
    /* Syntax: array.find(callback)
    array → the array you’re searching through (here it’s tasks).
    callback → a function that runs on every element in the array until it returns true.
    The .find() method then returns the first element for which the callback is true.
    If no element matches, it returns undefined.
    For each t (each task object) inside the tasks array:
       It checks whether that task’s ID property matches the given t_id.
       When a match is found, .find() stops searching and returns that object.*/
    const task = tasks.find(t => t.ID === t_id && t.isActive === true);


    // If t.ID !== t_id, not found
    if (!task) {
        console.log(`Task ID '${t_id}' not found.`);
        return;
    }
    console.log(`\nCurrent Task Details for ${t_id}:`);
    // creating a new array
    console.table([task]);  // task refers to a single task object that was found in the array tasks.

    const newName = await askQuestion(rl, "Enter new Task Name (press Enter to skip): ");
    const newDesc = await askQuestion(rl, "Enter new Description (press Enter to skip): ");
    console.log("\nSelect new Status (press Enter to skip):");

    // forEach() - to iterate (loop) through each element of an array.
    /* Syntax: array.forEach(callback(currentElement, index, array))
       callback → a function executed once for each element in the array.
       currentElement → the element currently being processed.
       index → the index (position) of that element in the array (starts from 0).
       array → the entire array (optional parameter).
    */
    // not return anything
    allowedStatuses.forEach((status, index) => console.log(`${index + 1}. ${status}`));  // index start at 0

    const statusChoice = await askQuestion(rl, "Choose status (1–4) or press Enter to keep existing: ");  // user input for status attribute

    if (newName) task.TaskName = newName;
    if (newDesc) task.Description = newDesc;

    if (statusChoice) {
        const statusIndex = Number(statusChoice) - 1;  // holding index position of the status choice
        // guarded assignment   
        // Ensures statusIndex is not negative & statusIndex is less than allowedStatuses.length
        if (statusIndex >= 0 && statusIndex < allowedStatuses.length) {
            /*It updates the task’s Status, but only if the new status exists.
            If the new status is undefined (invalid index), it keeps the old status.
            allowedStatuses is usually an array, statusIndex is a number the user entered (0, 1, 2).
            We don’t want to assign undefined to task.Status.
            So we use the Nullish Coalescing Operator ??.
            ?? only checks for: null or undefined
            If allowedStatuses[statusIndex] is a valid status → use it
            If it is undefined (invalid index) → use task.Status (keep original)*/
            task.Status = allowedStatuses[statusIndex] ?? task.Status;
            // task.Status = allowedStatuses[statusIndex];
        } else {
            console.log("Invalid status choice. Keeping previous status.");
        }
    }

    task.UpdatedAt = getCurrentDateTime(); // updates the date & time while updating the task

    console.log("\nTask updated successfully!");
    console.table([task]);  // displays task[] in a table - only that task object

}

// To Retrieve a single task from task ID
async function getSpecificTask() {
    if (tasks.length === 0) {
        console.log("\nNo tasks available.");
        return;
    }

    console.table(tasks);
    const t_id = await askQuestion(rl, "Enter the Task ID to view: ");

    // Use .find() to get the task object directly
    const task = tasks.find(task => task.ID === t_id);

    if (task) { // if task found
        console.log(`\nTask Details for ID ${t_id}:`); // displays a single task object into array in a table format
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
    // find the position (index) of a specific task object in an array, based on a matching condition.
    // returns -1, if not found
    const index = tasks.findIndex(task => task.ID === t_id); // It loops through each element of the array and returns the index (number) of the first element that satisfies a given condition.

    if (index !== -1) { // if index found
        // Remove that task from the array
        /* Array.prototype.splice(start, deleteCount, ...itemsToAdd)   
              start — index at which to start changing the array.
              deleteCount — number of elements to remove starting from start.
              Returns an array of the removed elements.*/
        const deletedTask = tasks.splice(index, 1);
        console.log(`Task ${deletedTask[0]?.ID ?? 'Unknown'} deleted successfully.`);
    } else {
        console.log(`Task ID '${t_id}' not found.`);
    }
}

async function activeToInactive(){
    const t_id = await askQuestion(rl, "Enter the task ID: ");
    const task = tasks.find((t) => t.ID === t_id && t.isActive===true)
    if(!task){
        console.log("Task not found")
        return
    }
    task.isActive=false
}

// This means the function does not return anything.
function exitApp(): void {
    console.log("Exiting the application...");
    rl.close(); // closes the readline interface
    // process is a global object in Node.js that represents the current running process.
    // 0 is the usual convention for successful / normal termination.
    process.exit(0); // exits the Node.js process and return the integer code to the operating system.
}

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


// when created task shld be Active (default), while get() - returen only active tasks
// update only active tasks
// function toInactive() - from active to inactive

// taskID

// task?.isActive - getting error above if stmt, not error in if stamt


// functions parameterized
// get input and pass into func 
// type 
// new project for typescript

