import { UserPayload } from "./registerForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./axiosClient";

export default function SpecificUser() {
    const [rows, setRows] = useState<UserPayload[]>([]);
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        const fetchUsers = async () => {

            try {
                const res = await api.get(`/users/${id}`);
                const u: UserPayload = res.data?.user ?? res.data

                const normalized = {
                    ...u,
                    createdAt: u.createdAt ? new Date(u.createdAt as any).toLocaleString() : undefined,
                    updatedAt: u.updatedAt ? new Date(u.updatedAt as any).toLocaleString() : undefined
                }

                setRows([normalized])

                // const user = res.data.user ?? res.data;
                // // Ensure it's shaped like UserPayload and wrap as array
                // return setRows(user ? [user] : []);
            }
            catch (err: any) {
                const msg =
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch users.";
            }
        }
        fetchUsers()
    }, [id]);

    const toggleActive = async (userId: number) => {
        setRows(prev =>
            prev.map(row =>
                row.userId === userId ? { ...row, isActive: !row.isActive } : row
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
                    row.userId === userId ? { ...row, isActive: row.isActive } : row
                )
            );
            console.error(
                "Failed to update user.",
                err?.response?.data?.message || err?.message || err
            );

        }
    };

    const editButton = (id: number) => navigate(`/users/f_update/${id}`);

    const logout = () => {
        navigate("/")
    }

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <div className="bg-pink-200 mx-auto my-40 rounded-xl shadow p-5 border w-5xl">
            <h2 className="font-semibold mb-4 text-center text-lg">Single User</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-sm text-center">User ID</th>
                            <th className="border p-2 text-sm text-center">Name</th>
                            <th className="border p-2 text-sm text-center">Email</th>
                            {/* <th className="border p-2 text-sm text-center">Password</th> */}
                            <th className="border p-2 text-sm text-center">Age</th>
                            <th className="border p-2 text-sm text-center">IsActive</th>
                            <th className="border p-2 text-sm text-center">Created At</th>
                            <th className="border p-2 text-sm text-center">Updated At</th>
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
                                    <label className="inline-flex items-center cursor-pointer select-none">
                                        <input type="checkbox" checked={r.isActive} onChange={() => toggleActive(r.userId)} className="sr-only" />
                                        <div className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${!!r.isActive ? "bg-green-500" : "bg-gray-300"} flex items-center`}>
                                            <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${!!r.isActive ? "translate-x-8" : "translate-x-0"}`} />
                                        </div>
                                    </label>
                                </td>
                                <td className="border p-2">{r.createdAt}</td>
                                <td className="border p-2">{r.updatedAt}</td>
                                <div className="bg-pink-200 p-2 text-center">
                                    <button type="button" onClick={() => editButton(r.userId)} className="text-white bg-pink-400 border-2 px-3 py-2 rounded-xl hover:bg-pink-600">
                                        Edit
                                    </button>
                                </div>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={handleClick} className="text-white bg-blue-300 border-2 my-4 px-4 py-3 rounded-xl hover:bg-blue-400">
                    Go Back
                </button>
                <button type="submit" className="text-white bg-blue-300 border-2 m-4 px-4 py-3 rounded-xl hover:bg-blue-400" onClick={() => logout()}>
                    Logout
                </button>
            </div>
        </div>
    )
}
