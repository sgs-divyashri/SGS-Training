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

const tasks = []  // initialize in-memory array to store all the tasks as objects
var taskCounter = 1;  // to generate task id
let option;  // to enter the number of the menu
const allowedStatuses = ["To-Do", "In Progress", "Review", "Completed"];   // set values for status attribute to be constant

// Return the current date and time as a localized string.
function getCurrentDateTime() {
    return new Date().toLocaleString();  // returns current date and time from your system clock
}  // toLocaleString() - converts the Date object into a human-readable string, according to your computer’s locale (language + region settings), both date and time parts.

function generateTaskId() {  // Generate auto-increment task ID
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

// create a new task
async function createTask() {   
    const taskId = generateTaskId();  // call generateTaskId()
    const status = "To-Do"  // default status
    console.log(`\nCreating new task...`);
    console.log(`Task ID: ${taskId} (auto-generated)\n`);

    // Await - await pauses the execution of the current async function until the Promise resolves.
    const t_name = await askQuestion(rl, "Enter the task name: ");   // asks the question and waits for the user’s input.
    const t_desc = await askQuestion(rl, "Enter the task description: ");
    const createdAt = getCurrentDateTime();  // calls getCurrentDateTime()
    const updatedAt = createdAt;  // initially assigning createdAt value into updatedAt variable
    // push the attributes and values into the tasks[]
    tasks.push({ ID: taskId, TaskName: t_name, Description: t_desc, Status: status, CreatedAt: createdAt, UpdatedAt: updatedAt })  // make tasks[] as key-value pair to display keys in the console as titles and the value as its value
    console.log("\nTask created successfully!");
    // .length gives the total number of elements in the array.
    // The last item is at index tasks.length - 1
    // the square brackets [ ... ] create a new array containing only one element — the last task.
    console.table([tasks[tasks.length - 1]]); 
}

// To Retrieve all the tasks
async function getAllTasks() {   
    if (tasks.length === 0) {   // Check the total number of tasks, if num=0, then no tasks available 
        console.log("No Tasks found..")
    }
    else {
        console.log("All Tasks..")  
        console.table(tasks) // else, prints all the tasks in table format
    }
}

// Update a Specific Task
async function updateTask() {
    if (tasks.length === 0) {
    console.log("\nNo tasks available to update.");
    return;
    }
    
    console.table(tasks);  // First display all the tasks to know the available tasks
    const t_id = await askQuestion(rl, "\nEnter the Task ID to update: ");  // user input

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
    const task = tasks.find(t => t.ID === t_id);

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
    if (newName) task.TaskName = newName;  // update task name if value entered
    if (newDesc) task.Description = newDesc;  // update task description if value entered

    if (statusChoice) {   // if status choice is entered,
        const statusIndex = Number(statusChoice) - 1; // holding index position of the status choice
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

