import CreateTaskInputs from "./createTaskInputs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import NavBar from "../components/navbar";

export interface TaskPayload {
    taskId: string;
    taskName: string;
    description?: string;
    status?: string;
    createdBy: number | string;
    isActive: boolean,
    createdAt?: Date;
    updatedAt?: Date;
}

export type FieldType = "text" | "number"

export interface FieldConfig {
    name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy">,
    label: string,
    type: FieldType,
    placeholder: string,
    min?: number
}

export const fields: FieldConfig[] = [
    { name: "taskName", label: "TaskName", type: "text", placeholder: "Enter Task Name" },
    { name: "description", label: "Description", type: "text", placeholder: "Enter Task Description" },
    { name: "createdBy", label: "CreatedBy", type: "number", placeholder: "Enter the created User ID", min: 1 },
];

export default function CreateTask() {
    const navigate = useNavigate();

    // form state owned by parent
    const [values, setValues] = useState({
        taskName: "",
        description: "",
        createdBy: "" as number | "",
    });
    const [tasks, setTasks] = useState<TaskPayload[]>([])

    const handleChange = async (name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy">, raw: string) => {
        setValues(prev => {
            if (name === "createdBy") {
                const num = raw === "" ? "" : Number(raw);
                return { ...prev, createdBy: num };
            }
            return { ...prev, [name]: raw };
        });

        if (!name.trim()) {
            alert("Please fill in all fields.");
            return;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { taskName, description, createdBy } = values;

        // validations
        if (!taskName.trim() || !description.trim() || createdBy === "") {
            alert("Please fill in all fields.");
            return;
        }
        if (Number(createdBy) <= 0) {
            alert("Age must be a positive number.");
            return;
        }

        try {
            const payload = {
                taskName: taskName.trim(),
                description: description.trim(),
                createdBy: Number(createdBy),
                isActive: true,
            };

            const res = await axios.post("http://localhost:3000/tasks", payload)
            const createdTask = res.data;

            setTasks((prev) => [createdTask, ...prev]);

            setValues({ taskName: "", description: "", createdBy: "" });
            navigate("/tasks");
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

    return (
        <div>
            <NavBar/>
            <div className="min-h-screen bg-[#B0E0E6] p-6">
                <div className="mx-auto max-w-2xl m-12 grid grid-cols-1">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                        <h1 className="mb-4 text-center font-bold text-xl">Register Task</h1>
                        < CreateTaskInputs fields={fields} values={values} onChange={handleChange} />
                        <div className="flex justify-center gap-3 m-3">
                            <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}