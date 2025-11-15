async function activeToInactive(){
    const t_id = await askQuestion(rl, "Enter the task ID: ");
    const task = tasks.find((t) => t.ID === t_id && t.isActive===true)
    if(!task){
        console.log("Task not found")
        return
    }
    task.isActive=false
}
