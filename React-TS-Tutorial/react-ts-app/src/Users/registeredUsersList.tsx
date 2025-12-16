import { UserPayload } from "./registerForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./axiosClient";

export default function UsersList() {
    const [rows, setRows] = useState<UserPayload[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                return setRows(res.data.users)
            }
            catch (err: any) {
                const msg =
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch users.";
            }
        }
        fetchUsers()
    }, []);

    const toggleActive = (userId: number) => {
        setRows(prev =>
            prev.map(row =>
                row.userId === userId ? { ...row, isActive: !row.isActive } : row
            )
        );
    };

    const editButton = () => {
        const { id } = useParams<{ id: string }>()
        navigate(`/users/f_update/${id}`)
    }

    const handleClick = () => {
        navigate(-1);
    }

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
                            {/* <th className="border p-2 text-sm text-center">Password</th> */}
                            <th className="border p-2 text-sm text-center">Age</th>
                            <th className="border p-2 text-sm text-center">IsActive</th>
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
                                    {/* <td className="border p-2">{r.password}</td> */}
                                    <td className="border p-2">{r.age}</td>
                                    <td className="border p-2 text-center">
                                        <button type="button" onClick={() => toggleActive(r.userId)}
                                            aria-pressed={r.isActive}
                                            className={`inline-flex items-center h-4 w-8 px-3 py-1 rounded-full  ${r.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                                            <span className={`flex inline-block h-2 w-2 rounded-full ${r.isActive ? "bg-white justify-end" : "bg-gray-700"}`} />
                                        </button>
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button type="button" onClick={() => editButton()} className="text-white bg-pink-400 border-2 px-6 py-3 rounded-xl hover:bg-pink-600">Edit</button>
                                        {/* <button>Delete</button> */}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={handleClick} className="text-white bg-blue-300 border-2 my-4 px-4 py-3 rounded-xl hover:bg-blue-400">
                    Go Back
                </button>
            </div>
        </div>
    )
}
