import RegisterInputs from "./registerInputs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export interface UserPayload {
    userId: number;
    name: string;
    email: string;
    password: string;
    age: number | "",
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type FieldType = "text" | "email" | "password" | "number"

export interface FieldConfig {
    name: keyof Pick<UserPayload, "name"|"email"|"password"|"age">,
    label: string,
    type: FieldType,
    placeholder: string,
    min?: number
}

const fields: FieldConfig[] = [
    {name: "name", label: "Name", type: "text", placeholder: "Enter Full Name" },
    {name: "email", label: "Email", type: "email", placeholder: "Enter email ID" },
    {name: "password", label: "Password", type: "password", placeholder: "Enter Password" },
    {name: "age", label: "Age", type: "number", placeholder: "Enter age", min: 1 },
];

export default function RegisterForm() {
    const navigate = useNavigate();

    // form state owned by parent
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        age: "" as number | "", 
    });

    const handleChange = (name: keyof Pick<UserPayload, "name"|"email"|"password"|"age">, raw: string) => {
        setValues(prev => {
            if (name === "age") {
                const num = raw === "" ? "" : Number(raw);
                return { ...prev, age: num };
            }
            return { ...prev, [name]: raw };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { name, email, password, age } = values;

        // validations
        if (!name.trim() || !email.trim() || !password.trim() || age === "") {
            alert("Please fill in all fields.");
            return;
        }
        if (Number(age) <= 0) {
            alert("Age must be a positive number.");
            return;
        }

        const existing = JSON.parse(localStorage.getItem("users") ?? "[]") as UserPayload[];
        const nextId = existing.length > 0 ? Math.max(...existing.map(u => u.userId || 0)) + 1 : 1;

        const newRow: UserPayload = {
            userId: nextId,
            name: name.trim(),
            email: email.trim(),
            password,
            age: Number(age),
            isActive: true,
        };

        localStorage.setItem("users", JSON.stringify([...existing, newRow]));

        setValues({ name: "", email: "", password: "", age: "" });

        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#B0E0E6] p-6">
            <div className="mx-auto max-w-2xl m-12 grid grid-cols-1">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                    <h1 className="mb-4 text-center font-bold text-xl">Register User</h1>
                    < RegisterInputs fields={fields} values={values} onChange={handleChange} />
                    <div className="flex justify-center gap-3 m-3">
                        <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}