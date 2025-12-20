import { TaskPayload } from "./createTask";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../Users/axiosClient";
import NavBar from "../components/navbar";

export default function UsersTaskList() {
    const [rows, setRows] = useState<TaskPayload[]>([]);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get(`/tasks/me`);
                const data = res.data
                const normalized = (data?.tasks ?? []).map((t: TaskPayload) => ({
                    ...t,
                    createdAt: t.createdAt ? new Date(t.createdAt as any).toLocaleString() : undefined,
                    updatedAt: t.updatedAt ? new Date(t.updatedAt as any).toLocaleString() : undefined
                }))

                setRows(normalized);
            } catch (err: any) {
                console.error(
                    err?.response?.data?.message || err?.message || "Failed to fetch users."
                );
            }
        };
        fetchUsers();
    }, []);

    const toggleActive = async (taskId: string) => {
        setRows((prev) =>
            prev.map((row) =>
                row.taskId === taskId ? { ...row, isActive: !row.isActive } : row
            )
        );

        try {
            // call the correct backend endpoint
            const res = await api.patch(`/tasks/toggle/${taskId}`)       // restore (reactivate)

            // if backend returns updated user, sync with server truth
            const updated = res.data?.task;
            if (updated && typeof updated.isActive === "boolean") {
                setRows((prev) =>
                    prev.map((row) =>
                        row.taskId === taskId ? { ...row, isActive: !!updated.isActive } : row
                    )
                );
            }
        } catch (err: any) {
            setRows((prev) =>
                prev.map((row) =>
                    row.taskId === taskId ? { ...row, isActive: row.isActive } : row
                )
            );
            console.error(
                "Failed to update user.",
                err?.response?.data?.message || err?.message || err
            );

        }
    };

    const editButton = (id: string) => navigate(`/tasks/f_update/${id}`);

    return (
        <div>
            <NavBar />
            <div className="bg-pink-200 m-auto my-6 rounded-xl shadow p-5 border w-5xl">
                <h2 className="font-semibold mb-4 text-center text-lg">Tasks List</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-sm text-center">Task ID</th>
                                <th className="border p-2 text-sm text-center">Task Name</th>
                                <th className="border p-2 text-sm text-center">Description</th>
                                <th className="border p-2 text-sm text-center">Created By (User ID)</th>
                                <th className="border p-2 text-sm text-center">Status</th>
                                <th className="border p-2 text-sm text-center">IsActive</th>
                                <th className="border p-2 text-sm text-center">Created At</th>
                                <th className="border p-2 text-sm text-center">Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.taskId} className="bg-white">
                                    <td className="border p-2">{r.taskId}</td>
                                    <td className="border p-2">{r.taskName}</td>
                                    <td className="border p-2">{r.description}</td>
                                    <td className="border p-2">{r.createdBy}</td>
                                    <td className="border p-2">{r.status}</td>
                                    <td className="border p-2 text-center">
                                        <label className="items-center cursor-pointer select-none">
                                            <input type="checkbox" checked={!!r.isActive} onChange={() => toggleActive(r.taskId)} className="sr-only" />
                                            <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${!!r.isActive ? "bg-green-500" : "bg-gray-300"} flex items-center`}>
                                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${!!r.isActive ? "translate-x-6" : "translate-x-0"}`} />
                                            </div>
                                        </label>
                                    </td>
                                    <td className="border p-2">{r.createdAt}</td>
                                    <td className="border p-2">{r.updatedAt}</td>
                                    <td className="bg-pink-200 p-2 text-center">
                                        <button type="button" onClick={() => editButton(r.taskId)} className="text-white bg-pink-400 border-2 px-3 py-2 rounded-xl hover:bg-pink-600">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
