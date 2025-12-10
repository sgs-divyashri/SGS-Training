import { useState } from "react"

export default function FieldInputs() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Email: ", email)
        console.log("Password: ", password)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="email" name="email" placeholder="Enter email ID" required value={email} onChange={(e) => setEmail(e.target.value)}/> <br />
                <input type="password" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)}/> <br />
                <button type="submit">Login</button>
            </div>
        </form>
    )
}