import LoginInputs from "./loginInputs";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { UserPayload } from "./registerForm";

export type FieldType = "email" | "password"

export interface FieldConfig {
    name: keyof Pick<UserPayload, "email" | "password">,
    label: string,
    type: FieldType,
    placeholder: string,
}

const fields: FieldConfig[] = [
    { name: "email", label: "Email", type: "email", placeholder: "Enter email ID" },
    { name: "password", label: "Password", type: "password", placeholder: "Enter Password" },
];

export default function LoginForm() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const handleChange = (name: keyof Pick<UserPayload, "email"|"password">, raw: string) => {
        setValues(prev => {
            return { ...prev, [name]: raw };
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password } = values;

        // validations
        if ( !email.trim() || !password.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        setValues({ email: "", password: ""});

        navigate("/users");
    }

    return (
        <div className="min-h-screen bg-[#B0E0E6] p-6">
            <div className="mx-auto max-w-md m-12 gap-6">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                    <h1 className="mb-4 text-center font-bold text-xl">User Login</h1>
                    < LoginInputs fields={fields} values={values} onChange={handleChange} />
                    <div className="flex justify-center gap-3 m-3">
                        <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}