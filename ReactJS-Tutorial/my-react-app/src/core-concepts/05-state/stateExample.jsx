import { useState } from "react"

export default function StateExample() {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(count+1)
    }
    return <>
        <h1>State Example</h1>
        <p>Counter {count}</p>
        <button onClick={handleClick} className="bg-color">Increment</button>
    </>
}