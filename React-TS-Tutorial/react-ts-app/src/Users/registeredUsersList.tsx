
import { UserPayload } from "./registerForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./axiosClient";

export default function UsersList() {
    const [rows, setRows] = useState<UserPayload[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                const normalized = res.data?.users ?? []
                setRows(normalized);
            } catch (err: any) {
                console.error(
                    err?.response?.data?.message || err?.message || "Failed to fetch users."
                );
            }
        };
        fetchUsers();
    }, []);

    const toggleActive = async (userId: number) => {
        const target = rows.find((r) => r.userId === userId);
        if (!target) return;

        const isCurrentlyActive = Boolean(target.isActive);
        const nextIsActive = !isCurrentlyActive;

        setRows((prev) =>
            prev.map((row) =>
                row.userId === userId ? { ...row, isActive: nextIsActive } : row
            )
        );

        try {
            // call the correct backend endpoint
            const res = await api.patch(`/users/toggle/${userId}`)       // restore (reactivate)

            // if backend returns updated user, sync with server truth
            const updated = res.data?.user;
            if (updated && typeof updated.isActive === "boolean") {
                setRows((prev) =>
                    prev.map((row) =>
                        row.userId === userId ? { ...row, isActive: !!updated.isActive } : row
                    )
                );
            }
        } catch (err: any) {
            setRows((prev) =>
                prev.map((row) =>
                    row.userId === userId ? { ...row, isActive: isCurrentlyActive } : row
                )
            );
            console.error(
                "Failed to update user.",
                err?.response?.data?.message || err?.message || err
            );

        }
    };

    const editButton = (id: number) => navigate(`/users/f_update/${id}`);
    const logout = () => navigate("/");
    const handleClick = () => navigate(-1);

    return (
        <div className="bg-pink-200 m-auto my-6 rounded-xl shadow p-5 border w-5xl">
            <h2 className="font-semibold mb-4 text-center text-lg">Registered Users</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-sm text-center">User ID</th>
                            <th className="border p-2 text-sm text-center">Name</th>
                            <th className="border p-2 text-sm text-center">Email</th>
                            <th className="border p-2 text-sm text-center">Age</th>
                            <th className="border p-2 text-sm text-center">IsActive</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.userId} className="bg-white">
                                <td className="border p-2">{r.userId}</td>
                                <td className="border p-2">{r.name}</td>
                                <td className="border p-2">{r.email}</td>
                                <td className="border p-2">{r.age}</td>
                                <td className="border p-2 text-center">
                                    <label className=" items-center cursor-pointer select-none">
                                        <input type="checkbox" checked={!!r.isActive} onChange={() => toggleActive(r.userId)} className="sr-only" />
                                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${!!r.isActive ? "bg-green-500" : "bg-gray-300"} flex items-center`}>
                                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${!!r.isActive ? "translate-x-6" : "translate-x-0"}`} />
                                        </div>
                                    </label>
                                </td>
                                <td className="bg-pink-200 p-2 text-center">
                                    <button type="button" onClick={() => editButton(r.userId)} className="text-white bg-pink-400 border-2 px-3 py-2 rounded-xl hover:bg-pink-600">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <button type="button" onClick={handleClick} className="text-white bg-blue-300 border-2 m-4 px-4 py-3 rounded-xl hover:bg-blue-400">
                    Go Back
                </button>
                <button type="button" className="text-white bg-blue-300 border-2 m-4 px-4 py-3 rounded-xl hover:bg-blue-400" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
