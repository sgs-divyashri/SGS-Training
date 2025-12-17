
import { UserPayload } from "./registerForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./axiosClient";

export default function UsersList() {
    const [rows, setRows] = useState<UserPayload[]>([]);
    const [pending, setPending] = useState<Record<number, boolean>>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                const normalized = (res.data?.users ?? []).map((u: any) => ({
                    ...u,
                    isActive: Boolean(u.isActive),
                }));
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

        // optimistic UI
        setRows((prev) =>
            prev.map((row) =>
                row.userId === userId ? { ...row, isActive: nextIsActive } : row
            )
        );
        // setPending((p) => ({ ...p, [userId]: true }));

        try {
            // call the correct backend endpoint
            const res = await api.patch(`/users/toggle/${userId}`)       // restore (reactivate)
                   // soft delete (deactivate)

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
            // rollback on failure
            setRows((prev) =>
                prev.map((row) =>
                    row.userId === userId ? { ...row, isActive: isCurrentlyActive } : row
                )
            );
            console.error(
                "Failed to update user.",
                err?.response?.data?.message || err?.message || err
            );
        } finally {
            setPending((p) => {
                const { [userId]: _, ...rest } = p;
                return rest;
            });
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
                            <th className="border p-2 text-sm text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!Array.isArray(rows) || rows.length === 0 ? (
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
                                    <td className="border p-2">{r.age}</td>
                                    <td className="border p-2 text-center">
                                        <label className=" items-center cursor-pointer select-none">
                                            <input type="checkbox" checked={!!r.isActive} onChange={() => toggleActive(r.userId)} className="sr-only peer"/>
                                            <div className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${!!r.isActive ? "bg-green-500" : "bg-gray-300"} flex items-center ${pending[r.userId] ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500`} tabIndex={0} onKeyDown={(e) => { if (pending[r.userId]) return; if (e.key === "Enter" || e.key === " ") {e.preventDefault(); toggleActive(r.userId);}}}>
                                                <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${!!r.isActive ? "translate-x-8" : "translate-x-0"}`}/>
                                            </div>
                                        </label>
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button type="button" onClick={() => editButton(r.userId)} className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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
