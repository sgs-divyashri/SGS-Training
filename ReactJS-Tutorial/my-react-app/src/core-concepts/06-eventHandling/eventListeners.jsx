import { useState } from "react"

export default function EventHandling() {
    const [msg, setMsg] = useState("")
    const handleChange = (event) => {
        setMsg(event.target.value)
    }
    return <>
        <h1>Event Handling</h1>
        <input type="text" onChange={handleChange} placeholder="Enter text..." />
        <p>{msg}</p>
    </>
}