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