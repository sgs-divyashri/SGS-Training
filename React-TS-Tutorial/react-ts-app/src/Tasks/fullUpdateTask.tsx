import UpdateTaskInputs from "./fullUpdateTaskInputs";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/navbar";
import { TaskPayload } from "./createTask";
import { FieldType } from "./createTask";
// import { fields } from "./createTask";
import { api } from "../Users/axiosClient";

export interface FieldConfig {
    name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">,
    label: string,
    type: FieldType,
}

export const fields: FieldConfig[] = [
    { name: "taskName", label: "TaskName", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "createdBy", label: "CreatedBy", type: "number" },
    { name: "status", label: "Status", type: "text" },
];

export default function FullUpdateTask() {
    const navigate = useNavigate();

    // form state owned by parent
    const [values, setValues] = useState({
        taskName: "",
        description: "",
        createdBy: "",
        status: ""
    });
    const [tasks, setTasks] = useState<TaskPayload[]>([])
    const { id } = useParams<{ id: string }>()

    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users")
                const normalized = res.data?.users ?? []
                const opts = (normalized || []).map((u: any) => ({
                    value: String(u.userId),
                    label: String(u.email),
                }));
                setUserOptions(opts);
            }
            catch (err: any) {
                const message = err.response?.data?.message ||
                    err.response?.data?.error ||
                    err.message ||
                    "Failed to load users";
                console.error(message);
            }
        }
        fetchUsers();
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/tasks/${id}`);
                const user = res.data.task
                setValues({
                    taskName: user.taskName,
                    description: user.description,
                    createdBy: user.createdBy,
                    status: user.status
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

    const handleChange = async (name: keyof Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">, raw: string) => {
        setValues(prev => {
            return { ...prev, [name]: raw };
        });

        if (!name.trim()) {
            alert("Please fill in all fields.");
            return;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { taskName, description, createdBy, status } = values;

        // validations
        // if (!taskName.trim() || !description.trim() || createdBy === "") {
        //     alert("Please fill in all fields.");
        //     return;
        // }

        try {
            const payload = {
                taskName: taskName.trim(),
                description: description.trim(),
                createdBy: createdBy,
                status: status,
                isActive: true,
            };

            const res = await api.put(`/tasks/f_update/${id}`, payload)
            const createdTask = res.data;

            setTasks((prev) => [createdTask, ...prev]);
            navigate("/users-task");
            setValues({ taskName: "", description: "", createdBy: "", status: "" });
            
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
            <NavBar />
            <div className="min-h-screen bg-[#B0E0E6] p-6">
                <div className="mx-auto max-w-2xl m-12 grid grid-cols-1">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                        <h1 className="mb-4 text-center font-bold text-xl">Update Task</h1>
                        < UpdateTaskInputs fields={fields} values={values} onChange={handleChange} createdByOptions={userOptions} />
                        <div className="flex justify-center gap-3 m-3">
                            <button type="submit" className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}