import { useState } from "react"

export default function AddTasks({addTask}) {
    const [value, setValue] = useState("")

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (value.trim()){
            console.log("Form submited", value)
            addTask(value)
            setValue("")
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="add-task-action">
                <input type="text" onChange={handleChange} placeholder="Add task..." className="add-task-inp" value={value}/>
                <button type="submit" className="add-task-btn">Add</button>
            </div>
        </form>
    )
}