export {createTask};
import {askQuestion, getCurrentDateTime} from "./index"

let taskCounter: number = 1;  // task id shld start from 1

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
