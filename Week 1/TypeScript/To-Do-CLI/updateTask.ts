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
