"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Item } from "../../global";

export default function Form(props) {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) redirect("/dashboard");
    }, [session]);

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Item[]>([]);
    const [editing, setEditing] = useState<{ id: string } | null>(null);
    const [newName, setNewName] = useState<string>('');

    const src = props.direction;

    useEffect(() => {
        if (session?.user?.role) {
            setIsLoading(true);
            fetchData();
        }
    }, [session, editing]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/fetch/${src}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resJSON = await res.json();
            if (resJSON && Array.isArray(resJSON.fetchedItem)) {
                setData(resJSON.fetchedItem);
            } else {
                console.error('Fetched data is not in the expected format');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/fetch/${src}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedData = data.filter(item => item._id !== id);
            setData(updatedData);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEdit = (id: string, name: string) => {
        setEditing({ id });
        setNewName(name);
    };

    const handleUpdate = async () => {
        if (!editing) return;
        const { id } = editing;
        try {
            const response = await fetch(`/api/fetch/${src}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedItem = await response.json();
            const updatedData = data.map(item =>
                item._id === id ? { ...item, name: updatedItem.name } : item
            );
            setData(updatedData);
            setEditing(null);
            setNewName('');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!name) {
            setError("Name can't be blank");
            setIsSubmitting(false);
            return;
        }
        try {
            const resNameExists = await fetch('/api/check', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ src, name })
            });

            const { payload } = await resNameExists.json();
            if (payload) {
                setError(`${src} already exists`);
                setIsSubmitting(false);
                return;
            }

            const res = await fetch('/api/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ src, name })
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                setError("");
                fetchData();
                setName("");
            } else {
                setError("Registration failed");
            }
            setIsSubmitting(false);
        } catch (error) {
            console.log(error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6 h-full items-center">
            <h1 className="text-xl font-bold my-4 to-black">Add {props.direction}</h1>
            <form action="" className="" onSubmit={handleSubmit}>
                <input type="text" maxLength={30} minLength={3} className="mr-2" onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <button disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Submit</button>

                {error && (
                    <div className="bg-red-500 text-white text-sm w-fit py-1 px-3 rounded-md mt-2">{error}</div>
                )}
            </form>
            <div className="flex flex-col items-center">
                Widzę sprzęt | tabela | sortowanie | searchbar | dodaj zdarzenie(onClick)

                {isLoading ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : (
                    <div className="w-6/12">
                        <table className="border-separate border-spacing-5 table-fixed w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className="w-28">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item._id}>
                                        <td className="w-96">
                                            {editing && editing.id === item._id ? (
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                />
                                            ) : (
                                                item.name
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {editing && editing.id === item._id ? (
                                                <button onClick={handleUpdate}>Update</button>
                                            ) : (
                                                <>
                                                    <button className="p-1 bg-green-500 hover:bg-green-600 text-white" onClick={() => handleEdit(item._id, item.name)}>Edit</button>&nbsp;
                                                    <button className="p-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(item._id)}>Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
