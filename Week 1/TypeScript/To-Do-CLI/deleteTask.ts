async function deleteTask() {
    if (tasks.length === 0) {
        console.log("No tasks to delete.");
        return;
    }

    console.log("\nCurrent Tasks:");
    console.table(tasks);

    // const t_id = await askQuestion(rl, "Enter the task ID: ");
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