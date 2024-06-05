"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Appliance, ApplianceExtended } from "../../global";

export default function Dash() {

    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{ [key: string]: Appliance[] }>({});
    const [data2, setData2] = useState<{ [key: string]: ApplianceExtended[] }>({});
    const [editing, setEditing] = useState<{ category: string, id: string, } | null>(null);
    const [newName, setNewName] = useState<{ appliance: string, inventoryNumber: Number, model: string, notes: string } | null>(null);
    const [details, setDetails] = useState<{ id: string } | null>(null);
    const [viewDetails, setViewDetails] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [editing])

    const fetchData = async () => {
        if (!session?.user?.role) redirect("/dashboard")
        try {
            const resNameExists = await fetch(`/api/fetch3`, {
                method: "GET", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resNameExistsJSON = await resNameExists.json();
            console.log(resNameExistsJSON);
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
    const fetchDetails = async (id: string) => {
        if (!session?.user?.role) redirect("/dashboard")
        try {
            const resNameExists = await fetch(`/api/fetch3/${id}`, {
                method: "GET", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resNameExistsJSON = await resNameExists.json();
            console.log(resNameExistsJSON);
            if (resNameExistsJSON && typeof resNameExistsJSON === 'object') {
                setData2(resNameExistsJSON);
            } else {
                console.error('Fetched data is not in the expected format');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleDetails = async (id: string) => {
        setViewDetails(!viewDetails);
        if (viewDetails) {
            setDetails({ id: id });
            fetchDetails(id);
        }
        else setDetails(null);
    }

    const handleDelete = async (category: string, id: string) => {
        if (!session?.user?.role) redirect("/dashboard")
        try {
            const response = await fetch(`/api/fetch3/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedCategory = data[category].filter(item => item._id !== id);
            setData({ ...data, [category]: updatedCategory });
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEdit = (category: string, id: string, inventoryNumber: Number, model: string, appliance: string, notes: string) => {
        setEditing({ category, id });
        setNewName({ inventoryNumber, model, appliance, notes });
    };


    const handleUpdate = async () => {
        if (!session?.user?.role) redirect("/dashboard")
        if (!editing) return;
        const { category, id } = editing;
        try {
            const response = await fetch(`/api/fetch3/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appliance: newName.appliance,
                    inventoryNumer: newName.inventoryNumber,
                    model: newName.model,
                    notes: newName.notes,
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
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
            {
                isLoading ? (
                    <h1>Loading the data</h1>
                ) : (
                    <div className="">
                        {Object.keys(data).map((category) => (
                            <div key={category}>
                                <table className="border-separate border-spacing-5 table-fixed w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-16">Details</th>
                                            <th className="w-48">Inventory Number</th>
                                            <th className="w-48">Name</th>
                                            <th className="w-48">Model</th>
                                            <th>Notes</th>
                                            <th className=" w-28">Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data[category].map((item) => (<>
                                            <tr key={item._id}>
                                                <td className=" text-center text-xl cursor-pointer" onClick={(e) => handleDetails(item._id)}>&#8597;</td>
                                                <td className="w-96 text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className=" w-36"
                                                            type="number"
                                                            maxLength={30}
                                                            value={newName.inventoryNumber.toString()}
                                                            onChange={(e) => setNewName((prevState) => ({
                                                                ...prevState,
                                                                inventoryNumber: parseFloat(e.target.value),
                                                            }))}
                                                        />
                                                    ) : (
                                                        item.inventoryNumber.toString()
                                                    )}
                                                </td>
                                                <td className="w-96 text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className=" w-36"
                                                            type="text"
                                                            maxLength={30}
                                                            value={newName.appliance}
                                                            onChange={(e) => setNewName((prevState) => ({
                                                                ...prevState,
                                                                appliance: e.target.value,
                                                            }))}
                                                        />
                                                    ) : (
                                                        item.appliance
                                                    )}
                                                </td>
                                                <td className="w-96 text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className=" w-36"
                                                            maxLength={30}
                                                            type="text"
                                                            value={newName.model}
                                                            onChange={(e) => setNewName((prevState) => ({
                                                                ...prevState,
                                                                model: e.target.value,
                                                            }))}
                                                        />
                                                    ) : (
                                                        item.model
                                                    )}
                                                </td>
                                                <td className="w-52">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className=" w-36"
                                                            maxLength={2048}
                                                            type="text"
                                                            value={newName.notes}
                                                            onChange={(e) => setNewName((prevState) => ({
                                                                ...prevState,
                                                                notes: e.target.value,
                                                            }))}
                                                        />
                                                    ) : (
                                                        item.model
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <button onClick={handleUpdate}>Update</button>
                                                    ) : (
                                                        <>
                                                            <button className=" p-1 bg-green-500 hover:bg-green-600 text-white" onClick={() =>
                                                                handleEdit(category, item._id, item.inventoryNumber, item.model, item.appliance, item.notes)}>Edit</button>&nbsp;
                                                            <button className="p-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(category, item._id)}>Delete</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                {
                                                    details && details.id === item._id ? (
                                                        <td colSpan={6}>
                                                            {Object.keys(data2).map((category) => (
                                                                <table key={category} className="w-full">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className=" w-48 text-green-800">Serial Number </th>
                                                                            <th className="w-48 text-green-800">Attributes</th>
                                                                            <th className=" text-green-800">LogDate</th>
                                                                            <th className="text-green-800">Dates</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {data2[category].map((item) => (<>
                                                                            <tr key={item._id}>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (
                                                                                        item.serialNumber
                                                                                    )}
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Location: </b> {item.location}
                                                                                    </>)}
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Creation date: </b> {item.createdAt}
                                                                                    </>)}
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Buy date: </b> {item.buyDate}
                                                                                    </>)}
                                                                                </td>
                                                                            </tr>
                                                                            <tr key={item._id}>
                                                                                <td className="w-96 text-center">
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Manufacturer: </b> {item.manufacturer}
                                                                                    </>)}
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Update date: </b> {item.updatedAt.toString()}
                                                                                    </>)}
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Guarantee date: </b> {item.guaranteeDate.toString()}
                                                                                    </>)}
                                                                                </td>
                                                                            </tr>
                                                                            <tr key={item._id}>
                                                                                <td className="w-96 text-center">
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Provider: </b> {item.provider}
                                                                                    </>)}
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                </td>
                                                                                <td className="w-96 text-center">
                                                                                    {editing && editing.id === item._id ? (
                                                                                        <input
                                                                                            className=" w-36"
                                                                                            type="number"
                                                                                            maxLength={30}
                                                                                            value={newName.inventoryNumber.toString()}
                                                                                            onChange={(e) => setNewName((prevState) => ({
                                                                                                ...prevState,
                                                                                                inventoryNumber: parseFloat(e.target.value),
                                                                                            }))}
                                                                                        />
                                                                                    ) : (<>
                                                                                        <b>Review date: </b> {item.reviewDate.toString()}
                                                                                    </>)}
                                                                                </td>
                                                                            </tr>
                                                                        </>))}
                                                                    </tbody>
                                                                </table>
                                                            ))}
                                                        </td>
                                                    ) : (<></>)
                                                }
                                            </tr>
                                        </>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}