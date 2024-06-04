"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Item } from "../../global";

export default function Form(props) {
    const { data: session } = useSession();
    if (!session) redirect("/dashboard")

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{ [key: string]: Item[] }>({});
    const [editing, setEditing] = useState<{ category: string, id: string } | null>(null);
    const [newName, setNewName] = useState<string>('');

    const src = props.direction;
    const category = src;

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [editing])
    
    const fetchData = async () => {
        if (!session?.user?.role) redirect("/dashboard")
            try {
            const resNameExists = await fetch(`/api/fetch/${category}`, {
                method: "GET", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resNameExistsJSON = await resNameExists.json();
            if (resNameExistsJSON && typeof resNameExistsJSON === 'object') {
                setData(resNameExistsJSON);
                setIsLoading(false);
            } else {
                console.error('Fetched data is not in the expected format');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    const handleDelete = async (category: string, id: string) => {
        if (!session?.user?.role) redirect("/dashboard")
        try {
            const response = await fetch(`/api/fetch/${category}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedCategory = data[category].filter(item => item._id !== id);
            setData({ ...data, [category]: updatedCategory });
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };


    const handleEdit = (category: string, id: string, name: string) => {
        setEditing({ category, id });
        setNewName(name);
    };

    const handleUpdate = async () => {
        if (!session?.user?.role) redirect("/dashboard")
        if (!editing) return;
        const { category, id } = editing;
        try {
            const response = await fetch(`/api/fetch/${category}/${id}`, {
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
            const updatedCategory = data[category].map(item =>
                item._id === id ? { ...item, name: updatedItem.name } : item
            );
            setData({ ...data, [category]: updatedCategory });
            setEditing(null);
            setNewName('');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleSubmit = async (e) => {
        if (!session?.user?.role) redirect("/dashboard")
        e.preventDefault(); //check if it's not default
        setIsSubmitting(true);

        if (!name) {
            setError("Name can't be blank");
            setIsSubmitting(false);
            return;
        }
        try {

            //check if user exists 
            const resNameExists = await fetch('/api/check', {
                method: "POST", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ src, name }) //stringify converts value to json
            })

            const { payload } = await resNameExists.json(); //pass the searched result and asign to user
            //if user is not null return an error and exit the function
            if (payload) {
                setError(`${src} already exist`);
                setIsSubmitting(false);
                return;
            }

            //if user is not in the database we register 
            const res = await fetch('/api/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    src,
                    name
                })
            });


            //if the query is ok then we reset the form
            if (res.ok) {
                const form = e.target;
                form.reset();
                setError("");
                fetchData(); // Fetch the updated data after successful addition
                setData({});
                setName("");
            } else {
                setError("Registration failed");
            }
            setIsSubmitting(false);
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6 h-full items-center">
            <h1 className="text-xl font-bold my-4 to-black">Add {props.direction}</h1>
            <form action="" className="" onSubmit={handleSubmit}>
                <input type="text" maxLength={30} minLength={3} className="mr-2" onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <button disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Submit</button>

                {error && (
                    <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
                )}
            </form>
            <div className="flex flex-col items-center">
                Widzę sprzęt | tabela | sortowanie | searchbar |dodaj zdarzenie(onClick)

                {
                    isLoading ? (
                        <h1>Loading the data</h1>
                    ) : (
                        <div className="w-6/12">
                            {Object.keys(data).map((category) => (
                                <div key={category}>
                                    <table className="border-separate border-spacing-5 table-fixed w-full">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th className=" w-28">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data[category].map((item) => (
                                                <tr key={item._id}>
                                                    <td className=" w-96">
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
                                                    <td className=" text-center">
                                                        {editing && editing.id === item._id ? (
                                                            <button onClick={handleUpdate}>Update</button>
                                                        ) : (
                                                            <>
                                                                <button className=" p-1 bg-green-500 hover:bg-green-600 text-white" onClick={() => handleEdit(category, item._id, item.name)}>Edit</button>&nbsp;
                                                                <button className="p-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(category, item._id)}>Delete</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}