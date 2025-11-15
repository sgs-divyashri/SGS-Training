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