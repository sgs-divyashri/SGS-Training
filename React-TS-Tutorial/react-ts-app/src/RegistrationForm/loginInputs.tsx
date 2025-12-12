import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function LoginInputs() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const handleClick = () => {
        navigate("/users");
    }
    return (
        <form>
            <div className="flex items-center gap-4">
                <label className="font-semibold w-24">Email: </label>
                <input type="email" className="p-2 m-3 border-2 w-full mx-2 rounded-xl" placeholder="Enter email ID" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
                <label className="font-semibold w-24">Password: </label>
                <input type="password" className="p-2 m-3 border-2 w-full mx-2 rounded-xl" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex justify-center gap-3 m-3">
                <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600" onClick={() => handleClick()}>
                    Login
                </button>
            </div>
        </form>
    )
}