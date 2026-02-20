import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AddTaskRounded from "@mui/icons-material/AddTaskRounded";
import CreateRounded from "@mui/icons-material/CreateRounded";
import { getRole } from "../auth/getRole";
import { Modal } from "./Modal";
import { api } from "../axios/axiosClient";
import { RegisterForm } from "../types/authPage";
import { RegisterResponse } from "../types/authPage";
import toast from "react-hot-toast";

export const NavBar = () => {
    const navigate = useNavigate();
    const role = getRole();

    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [users, setUsers] = useState<{ email: string; userId: string }[]>([]);
    const [taskData, setTaskData] = useState({ name: "", description: "", assignedTo: "" });
    const [newUser, setNewUser] = useState<RegisterForm>({
        name: "",
        email: "",
        role: "User",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users");
                const list = Array.isArray(response.data.users)
                    ? response.data.users
                    : [];

                setUsers(list);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (role === "Admin") fetchUsers();
    }, [role]);

    const handleAddUsers = async (values: RegisterForm) => {
        try {
            if (!values.email || !values.password || !values.confirmPassword || !values.name) {
                toast.error("All fields are required");
                return;
            }
            if (values.password !== values.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            const res = await api.post<RegisterResponse>("/user/register", values);
            setShowAddUser(false)

            setNewUser({
                name: "",
                email: "",
                role: "User",
                password: "",
                confirmPassword: "",
            });

            toast.success(`User ${values.email} created successfully.`)

        } catch (error) {
            console.error("Error creating users:", error);
            toast.error("Error creating users.")
        }

    }

    const handleAddTasks = async () => {
        try {
            const { name, description, assignedTo } = taskData;

            if (!name.trim() || !description.trim() || !assignedTo) {
                toast.error("All fields are required");
                return;
            }

            const user = users.find(u => u.email === assignedTo);
            if (!user) {
                toast.error("Selected user not found");
                return;
            }

            const payload = {
                taskName: name,
                description,
                assignedTo: user.userId,
                status: "To-Do",
            };

            const res = await api.post("/create-tasks", payload);
            setShowAddTask(false)

            setTaskData({
                name: "",
                description: "",
                assignedTo: "",
            });

            toast.success(`Task created successfully.`)

        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Error creating task.")
        }

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white shadow border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
                    <div className="ml-auto flex items-center gap-4">
                        {role === "Admin" && (
                            <>
                                <button
                                    onClick={() => setShowAddTask(true)}
                                    className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200"
                                >
                                    <AddTaskRounded fontSize="small" />
                                    Add Tasks
                                </button>

                                <button
                                    onClick={() => setShowAddUser(true)}
                                    className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200"
                                >
                                    <CreateRounded fontSize="small" />
                                    Add Users
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 hover:text-red-600"
                        >
                            <LogoutIcon fontSize="small" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                <Outlet />
            </main>

            <Modal open={showAddTask} onClose={() => setShowAddTask(false)}>
                <h2 className="text-lg font-semibold mb-3">Add Task</h2>
                <input
                    name="name"
                    className="border w-full px-2 py-1 mb-2 rounded"
                    placeholder="Task Name"
                    onChange={handleInputChange}
                    value={taskData.name}
                />
                <input
                    name="description"
                    className="border w-full px-2 py-1 mb-2 rounded"
                    placeholder="Description"
                    onChange={handleInputChange}
                    value={taskData.description}
                />
                <select
                    name="assignedTo"
                    className="border w-full px-2 py-2 mb-2 rounded bg-white"
                    value={taskData.assignedTo}
                    onChange={handleInputChange}
                >
                    <option value="">Select a user (email)</option>
                    {users.map((user) => (
                        <option key={user.userId} value={user.email}>
                            {user.email}
                        </option>
                    ))}
                </select>
                <button
                    className="bg-blue-600 text-white px-3 py-1 rounded w-full mt-2"
                    onClick={() => handleAddTasks()}
                >
                    Save Task
                </button>
            </Modal >

            {/* -------- Add User Modal -------- */}
            < Modal open={showAddUser} onClose={() => setShowAddUser(false)}>
                <h2 className="text-lg font-semibold mb-3">Add User</h2>
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="border w-full px-2 py-1 mb-2 rounded">
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>
                <input
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    className="border w-full px-2 py-1 mb-2 rounded"
                    placeholder="Full Name"
                />
                <input
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    type="email"
                    className="border w-full px-2 py-1 mb-2 rounded"
                    placeholder="Email ID"
                />
                <input
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    type="password"
                    className="border w-full px-2 py-1 mb-2 rounded"
                    placeholder="Enter Password"
                />
                <input
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    type="password"
                    className="border w-full px-2 py-1 mb-2 rounded"
                    placeholder="Confirm Password"
                />
                <button
                    className="bg-blue-600 text-white px-3 py-1 rounded w-full mt-2"
                    onClick={() => handleAddUsers(newUser)}
                >
                    Save User
                </button>
            </Modal >
        </>
    );
};
