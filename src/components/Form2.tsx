"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Item {
    _id: string;
    name: string;
    email: string,
    phoneNumber: string,
    address: string,
    __v: number;
}
export default function Form2(props) {
    const { data: session } = useSession();
    if (!session) redirect("/dashboard")

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{ [key: string]: Item[]}>({});
    const [editing, setEditing] = useState<{ category: string, id: string } | null>(null);
    const [newName, setNewName] = useState<{ name: string, email: string, phoneNumber: string, address: string } | null>(null);

    const src = "provider";


    useEffect(() => {
        setIsLoading(true);
        fetchData();
        setIsLoading(false);
    }, [editing])

    const fetchData = async () => {
        if (!session?.user?.role) redirect("/dashboard")
        try {
            const resNameExists = await fetch(`/api/fetch2`, {
                method: "GET", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resNameExistsJSON = await resNameExists.json();
            if (resNameExistsJSON && typeof resNameExistsJSON === 'object') {
                setData(resNameExistsJSON);
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
            const response = await fetch(`/api/fetch2/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedCategory = data[category].filter(item => item._id !== id);
            setData({ ...data, [category]: updatedCategory });
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };


    const handleEdit = (category: string, id: string, name: string, email: string, phoneNumber: string, address: string) => {
        setEditing({ category, id });
        setNewName({ name, email, phoneNumber, address });
    };

    const handleUpdate = async () => {
        if (!session?.user?.role) redirect("/dashboard")
        if (!editing) return;
        const { category, id } = editing;
        try {
            const response = await fetch(`/api/fetch2/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName.name,
                    email: newName.email,
                    phoneNumber: newName.phoneNumber,
                    address: newName.address
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedItem = await response.json();
            const updatedCategory = data[category].map(item =>
                item._id === id ? {
                    ...item, name: updatedItem.name,
                    email: updatedItem.email,
                    phoneNumber: updatedItem.phoneNumber,
                    address: updatedItem.address
                } : item
            );
            setData({ ...data, [category]: updatedCategory });
            setEditing(null);
            setNewName({ name: "", email: "", phoneNumber: "", address: "" });
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleSubmit = async (e) => {
        if (!session?.user?.role) redirect("/dashboard")
        e.preventDefault(); //check if it's not default
        setIsSubmitting(true);

        if (!name || !email || !phoneNumber || !address) {
            setError("All fields are mandatory");
            setIsSubmitting(false);
            return;
        }
        try {

            //check if user exists 
            const resNameExists = await fetch('/api/check2', {
                method: "POST", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }) //stringify converts value to json
            })

            const { payload } = await resNameExists.json(); //pass the searched result and asign to user
            //if user is not null return an error and exit the function
            if (payload) {
                setError(`${src} already exist`);
                setIsSubmitting(false);
                return;
            }

            const res = await fetch('/api/fetch2', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phoneNumber,
                    address,
                })
            });


            //if the query is ok then we reset the form
            if (res.ok) {
                const form = e.target;
                form.reset();
                setError("");
                fetchData(); // Fetch the updated data after successful addition
                setData(null);
                setName("");
                setEmail("");
                setPhoneNumber("");
                setAddress("");
            } else {
                setError("Registration failed");
            }
            setIsSubmitting(false);
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className=" h-full shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6 items-center">
            <h1 className="text-xl font-bold my-4 to-black">Add provider</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className="flex flex-row">
                    <input type="text" maxLength={30} minLength={3} className="mr-2 w-full" onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <input type="text" maxLength={60} minLength={3} className="mr-2 w-full" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <input type="text" maxLength={30} minLength={3} className="mr-2 w-full" onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
                    <input type="text" maxLength={60} minLength={3} className="mr-2 w-full" onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                </div>
                <div className="flex justify-center flex-col items-center mt-10">
                    <button disabled={isSubmitting} className="w-40 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Submit</button>
                    {error && (
                        <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
                    )}
                </div>
            </form>
            <div className="flex flex-col items-center">
                Widzę sprzęt | tabela | sortowanie | searchbar |dodaj zdarzenie(onClick)

                {
                    isLoading ? (
                        <h1>Loading the data</h1>
                    ) : (
                        <div className="w-9/12">
                            {Object.keys(data).map((category) => (
                                <div key={category}>
                                    <table className="border-separate border-spacing-5 table-fixed w-full">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th className=" w-28">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data[category].map((item) => (
                                                <tr key={item._id}>
                                                    <td className="w-96">
                                                        {editing && editing.id === item._id ? (
                                                            <input
                                                                className=" w-36"
                                                                type="text"
                                                                value={newName.name}
                                                                onChange={(e) => setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    name: e.target.value,
                                                                }))}
                                                            />
                                                        ) : (
                                                            item.name
                                                        )}
                                                    </td>
                                                    <td className="w-96">
                                                        {editing && editing.id === item._id ? (
                                                            <input
                                                                className=" w-36"
                                                                type="email"
                                                                value={newName.email}
                                                                onChange={(e) => setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    email: e.target.value,
                                                                }))}
                                                            />
                                                        ) : (
                                                            item.email
                                                        )}
                                                    </td>
                                                    <td className="w-96">
                                                        {editing && editing.id === item._id ? (
                                                            <input
                                                                className=" w-36"
                                                                minLength={9}
                                                                maxLength={12}
                                                                type="text"
                                                                value={newName.phoneNumber}
                                                                onChange={(e) => setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    phoneNumber: e.target.value,
                                                                }))}
                                                            />
                                                        ) : (
                                                            item.phoneNumber
                                                        )}
                                                    </td>
                                                    <td className="w-96">
                                                        {editing && editing.id === item._id ? (
                                                            <input
                                                                className=" w-36"
                                                                type="text"
                                                                value={newName.address}
                                                                onChange={(e) => setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    address: e.target.value,
                                                                }))}
                                                            />
                                                        ) : (
                                                            item.address
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {editing && editing.id === item._id ? (
                                                            <button onClick={handleUpdate}>Update</button>
                                                        ) : (
                                                            <>
                                                                <button className=" p-1 bg-green-500 hover:bg-green-600 text-white" onClick={() =>
                                                                    handleEdit(category, item._id, item.name, item.email, item.phoneNumber, item.address)}>Edit</button>&nbsp;
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