import { useState } from "react"
import AddTasks from "./addNewTasks"
import './taskManager.css'
import TaskList from "./taskList"

export default function TaskManager() {
    const [tasks, setTasks] = useState([{task: "Sample Task"}])

    const addTask = (text) => {
        const newTask = {id: Date.now(), text, isActive: true, status: 'To-Do'}  
        setTasks([...tasks, newTask])
    }

    const toggleTask = (id) => {
        setTasks(tasks.map((task) => {
            return task.id == id ? {...task, isActive: !task.isActive} : task
        }))
    }
    return (
        <div>
            <h1>Task Manager</h1>
            <p>Start adding your tasks below 👇</p>
            <AddTasks addTask={addTask}/>
            <TaskList task={tasks} toggleTask={toggleTask}/>
            <p>Tasks: {tasks.length}</p>
        </div>
    )
}