
import { useState } from "react";
import { UserPayload } from "./registerForm";

let id = 1

type RegisterRow = UserPayload;

export default function RegisterInputs() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [age, setAge] = useState<number | undefined>(undefined);

    const [rows, setRows] = useState<RegisterRow[]>([]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!name.trim() || !email.trim() || !password.trim() || !age) {
            alert("Please fill all fields.");
            return;
        }
        if (Number(age) <= 0) {
            alert("Age must be a positive number.");
            return;
        }

        const newRow: RegisterRow = {
            userId: id++,
            name: name.trim(),
            email: email.trim(),
            password,
            age: Number(age),
            isActive: true
        };

        setRows((prev) => [...prev, newRow]);
        alert("User registered!");

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setAge(undefined);
    };


    const toggleActive = (userId: number) => {
        setRows(prev =>
            prev.map(row =>
                row.userId === userId ? { ...row, isActive: !row.isActive } : row
            )
        );
    };

    return (
        <div className="min-h-screen bg-[#B0E0E6] p-6">
            <div className="mx-auto max-w-6xl m-12 grid lg:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                    <h1 className="mb-4 text-center font-bold text-xl">Register User</h1>
                    <div className="flex items-center gap-4">
                        <label className="font-semibold w-24">Name: </label>
                        <input type="text" className="p-2 m-3 border-2 w-full mx-2 rounded-xl" placeholder="Enter Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="font-semibold w-24">Email: </label>
                        <input type="email" className="p-2 m-3 border-2 w-full mx-2 rounded-xl" placeholder="Enter email ID" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="font-semibold w-24">Password: </label>
                        <input type="password" className="p-2 m-3 border-2 w-full mx-2 rounded-xl" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="font-semibold w-24">Age: </label>
                        <input type="number" className="p-2 m-3 border-2 w-full mx-2 rounded-xl" placeholder="Enter age" required min={1} value={age ?? ""} onChange={(e) => { const val = e.target.value; setAge(val === "" ? undefined : Number(val)); }} />
                    </div>

                    <div className="flex justify-center gap-3 m-3">
                        <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                            Register
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-xl shadow p-6 border w-full">
                    <h2 className="font-semibold mb-4 text-center text-lg">Registered Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-center">User ID</th>
                                    <th className="border p-2 text-center">Name</th>
                                    <th className="border p-2 text-center">Email</th>
                                    <th className="border p-2 text-center">Password</th>
                                    <th className="border p-2 text-center">Age</th>
                                    <th className="border p-2 text-center">IsActive</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-3 text-gray-500">
                                            No registrations yet
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r) => (
                                        <tr key={r.userId} className="bg-white">
                                            <td className="border p-2">{r.userId}</td>
                                            <td className="border p-2">{r.name}</td>
                                            <td className="border p-2">{r.email}</td>
                                            <td className="border p-2">{r.password}</td>
                                            <td className="border p-2">{r.age}</td>
                                            <td className="border p-2">
                                                <button type="button" onClick={() => toggleActive(r.userId)}
                                                    aria-pressed={r.isActive}                                                   
                                                    className={`inline-flex items-center h-4 w-8 px-3 py-1 rounded-full  ${r.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                                                    <span className={`flex inline-block h-2 w-2 rounded-full ${r.isActive ? "bg-white justify-end" : "bg-gray-700"}`} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
