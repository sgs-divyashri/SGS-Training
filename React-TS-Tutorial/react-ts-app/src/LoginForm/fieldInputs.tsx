import { useState } from "react"

export default function FieldInputs() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert("Form submitted...")
        console.log("Email: ", email)
        console.log("Password: ", password)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="body">
                <div className="card">
                    <h1 className="card-title">Login Form</h1>
                    <input type="email" className="input-field" name="email" placeholder="Enter email ID" required value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                    <input type="password" className="input-field" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                    <button type="submit" className="login-btn">Login</button>
                    <button type="reset">Res</button>
                </div>
            </div>
        </form>
    )
}