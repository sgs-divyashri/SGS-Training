import RegisterInputs from "./registerInputs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "./axiosClient";
import { UserPayload } from "./registerForm";
import { fields } from "./registerForm";

export default function FullUpdateUser() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        age: "" as number | "",
    });
    const [users, setUsers] = useState<UserPayload[]>([]);

    const [emailStatus, setEmailStatus] = useState<{ state: "available" | "unavailable" | "error"; message?: string }>({ state: "available" });
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                const user = res.data.user
                setValues({
                    name: user.name,
                    email: user.email,
                    password: "",
                    age: typeof user.age === "number" ? user.age : "",
                })
            }
            catch (err: any) {
                const msg =
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load user.";
            }
        }
        fetchUser()
    }, [id])

    const handleChange = async (name: keyof Pick<UserPayload, "name" | "email" | "password" | "age">, raw: string) => {
        setValues(prev => {
            if (name === "age") {
                const num = raw === "" ? "" : Number(raw);
                return { ...prev, age: num };
            }
            return { ...prev, [name]: raw };
        });
    };

    const handleBlur = async () => {
        const email = values.email.trim().toLowerCase();
        if (!email) return;

        try {
            setEmailStatus({ state: "available" });
            const { data } = await api.post("/users/check-email", { email });
            if (data.available) {
                setEmailStatus({ state: "available" });
            } else {
                setEmailStatus({ state: "unavailable", message: data?.message || "Email is already in use." });
            }
        }
        catch (err: any) {
            setEmailStatus({
                state: "error",
                message: err.response?.data?.message || err.message || "Unable to verify email.",
            });
            alert(emailStatus.message || "Email is already registered.");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
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

        try {
            const payload = {
                name: name.trim(),
                email: email.trim(),
                password,
                age: Number(age),
                isActive: true,
            };

            const res = await api.put(`/users/f_update/${id}`, payload)
            const updatedUser = res.data;

            setUsers((prev) => [updatedUser, ...prev]);

            setValues({ name: "", email: "", password: "", age: "" });
            navigate("/login");
        }

        catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Registration failed";
            console.error(message);
        }
    };

    const handleClick = () => {
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-[#B0E0E6] p-6">
            <div className="mx-auto max-w-2xl m-12 grid grid-cols-1">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                    <h1 className="mb-4 text-center font-bold text-xl">Update User</h1>
                    < RegisterInputs fields={fields} values={values} onChange={handleChange} onEmailBlur={handleBlur} />
                    <div className="flex justify-center gap-3 m-3">
                        <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                            Update
                        </button>
                        <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600" onClick={() => handleClick()}>
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}