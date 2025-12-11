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
        <form onSubmit={handleSubmit} onReset={() => { setEmail(''); setPassword(''); }}>
            <div className="body">
                <div className="card">
                    <h1 className="mb-2 text-center font-bold">Login Form</h1>
                    <input type="email" className="p-3 m-3 border-2" name="email" placeholder="Enter email ID" required value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                    <input type="password" className="p-3 m-3 border-2" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                    <div className="button-container">
                        <button type="submit" className="text-white bg-pink-300 border-2-solid-black px-6 py-3 rounded-xl">Login</button>
                        <button type="reset" className="reset-btn">Res</button>
                    </div>
                </div>
            </div>
        </form>
    )
}