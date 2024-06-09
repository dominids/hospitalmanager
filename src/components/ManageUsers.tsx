"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Select from "./select";

export default function UserManagement() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUserData, setNewUserData] = useState(null);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: "name", direction: "ascending" });

    function SLocation(v) {
        setNewUserData({ ...newUserData, location: v })
    }

    useEffect(() => {
        fetchUsers();
    }, [editingUser]);

    const fetchUsers = async () => {
        if (!session?.user?.role) redirect("/dashboard");
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const users = await res.json();
            setUsersData(users);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Error fetching users");
            setIsLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setNewUserData(user);
    };

    const handleUpdate = async () => {
        if (!session?.user?.role) redirect("/dashboard");
        if (!editingUser) return;

        try {
            const response = await fetch(`/api/users/${newUserData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUserData),
            });
            if (response.ok) {
                fetchUsers();
                setEditingUser(null);
                setNewUserData(null);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!session?.user?.role) redirect("/dashboard");
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setUsersData(usersData.filter((user) => user._id !== id));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleRoleChange = (e) => {
        const isChecked = e.target.checked;
        setNewUserData({ ...newUserData, role: isChecked ? "admin" : "" });
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = (usersData) => {
        if (!sortConfig) return usersData;
        const sortedUsers = [...usersData];
        sortedUsers.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortedUsers;
    };

    const filteredUsers = () => {
        return usersData.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
            {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
            ) : (<>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table className="border-separate border-spacing-5 table-fixed w-full">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>
                                Name {sortConfig && sortConfig.key === 'name' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('email')}>
                                Email {sortConfig && sortConfig.key === 'email' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('role')}>
                                Admin {sortConfig && sortConfig.key === 'role' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('location')}>
                                Location {sortConfig && sortConfig.key === 'location' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                            </th>
                            <th className="w-28">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers(filteredUsers()).map((user) => (
                            <tr key={user._id}>
                                <td className="w-96 text-center">
                                    {editingUser === user._id ? (
                                        <input
                                            className="w-36"
                                            type="text"
                                            value={newUserData.name}
                                            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="w-96 text-center">
                                    {editingUser === user._id ? (
                                        <input
                                            className="w-36"
                                            type="email"
                                            value={newUserData.email}
                                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="w-96 text-center">
                                    {editingUser === user._id ? (
                                        <input
                                            className=" w-6"
                                            type="checkbox"
                                            checked={newUserData.role === "admin"}
                                            onChange={handleRoleChange}
                                        />
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td className="w-96 text-center">
                                    {editingUser === user._id ? (
                                        <Select category="location" value={SLocation} defaultChecked1={user.location}></Select>
                                    ) : (
                                        user.location
                                    )}
                                </td>
                                <td className="text-center">
                                    {editingUser === user._id ? (
                                        <button
                                            onClick={handleUpdate}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
                                            >
                                                Edit
                                            </button>
                                            &nbsp;
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>)}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
 