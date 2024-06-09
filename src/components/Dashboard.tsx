"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Appliance, Appliance2, ApplianceExtended } from "../../global";
import Select from "./select";
import EventDialog from "./EventDialog";

export default function Dash() {
    const { data: session } = useSession();

    const [data, setData] = useState<{ [key: string]: Appliance[] }>({});
    const [data2, setData2] = useState<{ [key: string]: Appliance2 }>({});
    const [newName, setNewName] = useState<ApplianceExtended | null>(null);
    const [editing, setEditing] = useState<{ category: string; id: string } | null>(null);
    const [details, setDetails] = useState<{ id: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewDetails, setViewDetails] = useState(true);
    const [preventDetails, setPreventDetails] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>({ key: "inventoryNumber", direction: "ascending" });

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [editing, response]);

    function SResponse(v) {
        setResponse(v);
    }
    function SAppliance(v) {
        setNewName((prevState) => ({
            ...prevState,
            appliance: v,
        }))
    }
    function SLocation(v) {
        setNewName((prevState) => ({
            ...prevState,
            location: v,
        }))
    }
    function SManufacturer(v) {
        setNewName((prevState) => ({
            ...prevState,
            manufacturer: v,
        }))
    }
    function SProvider(v) {
        setNewName((prevState) => ({
            ...prevState,
            provider: v,
        }))
    }

    const fetchData = async () => {
        if (!session) redirect("/dashboard");
        const loc = session.user?.location;
        try {
            var resNameExists;
            if (loc) {
                resNameExists = await fetch(`/api/fetch4/${loc}`, {
                    method: "GET", // method in API
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            else {
                resNameExists = await fetch(`/api/fetch3`, {
                    method: "GET", // method in API
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }

            console.log(loc);
            const resNameExistsJSON = await resNameExists.json();
            console.log(resNameExistsJSON);
            if (resNameExistsJSON && typeof resNameExistsJSON === "object") {
                setData(resNameExistsJSON);
                setIsLoading(false);
            } else {
                console.error("Fetched data is not in the expected format");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchDetails = async (id: string) => {
        if (!session?.user?.role) redirect("/dashboard");
        try {
            const resNameExists = await fetch(`/api/fetch3/${id}`, {
                method: "GET", // method in API
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resNameExistsJSON = await resNameExists.json();
            if (resNameExistsJSON && typeof resNameExistsJSON === "object") {
                setData2(resNameExistsJSON);
            } else {
                console.error("Fetched data is not in the expected format");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDetails = (id: string) => {
        if (!preventDetails) {
            setViewDetails(!viewDetails);
            if (viewDetails) {
                setDetails({ id });
                fetchDetails(id);
            } else setDetails(null);
        }
    };

    const handleDelete = async (category: string, id: string) => {
        if (!session?.user?.role) redirect("/dashboard");
        try {
            const response = await fetch(`/api/fetch3/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const updatedCategory = data[category].filter((item) => item._id !== id);
            setData({ ...data, [category]: updatedCategory });
            setViewDetails(!viewDetails);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleEdit = (category: string, item: ApplianceExtended) => {
        setPreventDetails(true);
        setEditing({ category, id: item._id });
        setNewName(item);
    };

    const handleUpdate = async () => {
        if (!session?.user?.role) redirect("/dashboard");
        if (!editing) return;
        const { category, id } = editing;

        const inventoryNumber = newName.inventoryNumber;
        const resNameExists = await fetch('/api/check3', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inventoryNumber, currentId: id }) // Send current ID as well
        });

        const { id2 } = await resNameExists.json();
        console.log(id2);
        // If id2 is found and it doesn't match the current editing ID, show an error
        if (id2 && id2 !== id) {
            setError("You can't change to an existing Inventory Number");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/fetch3/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newName),
            });
            fetchDetails(id);
            setEditing(null);
            setPreventDetails(false);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        try {
            const response = await fetch(`/api/addEvent/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                console.log("it's ok");
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    const handleSort = (key: string) => {
        let direction = "ascending";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = (items: Appliance[]) => {
        if (!sortConfig) return items;
        const sortedItems = [...items];
        sortedItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
        return sortedItems;
    };

    const filteredData = (items: Appliance[]) => {
        return items.filter((item) =>
            item.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.inventoryNumber.toString().includes(searchTerm.toLowerCase()) ||
            item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.event?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
            {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    {Object.keys(data).map((category) => (
                        <div key={category}>
                            <table className="border-separate border-spacing-5 table-fixed w-full">
                                <thead>
                                    <tr>
                                        {session?.user?.role ? (<th className="w-16">Details</th>) : (<></>)}
                                        <th className="w-48 cursor-pointer" onClick={() => handleSort('inventoryNumber')}>
                                            Inventory Number {sortConfig && sortConfig.key === 'inventoryNumber' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th className="w-48 cursor-pointer" onClick={() => handleSort('appliance')}>
                                            Name {sortConfig && sortConfig.key === 'appliance' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th className="w-48 cursor-pointer" onClick={() => handleSort('model')}>
                                            Model {sortConfig && sortConfig.key === 'model' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                                        </th>
                                        <th>Notes</th>
                                        <th className="w-48 cursor-pointer" onClick={() => handleSort('event')}>
                                            Event {sortConfig && sortConfig.key === 'event' && <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData(filteredData(data[category])).map((item) => (
                                        <>
                                            <tr key={item._id}>
                                                {session?.user?.role ? (<td
                                                    className="text-center text-xl cursor-pointer"
                                                    onClick={() => handleDetails(item._id)}>&#8597;
                                                </td>) : (<></>)}
                                                <td className="w-96 text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className="w-36"
                                                            type="number"
                                                            value={newName?.inventoryNumber.toString() || ""}
                                                            onChange={(e) =>
                                                                setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    inventoryNumber: parseFloat(e.target.value),
                                                                }))
                                                            }
                                                        />
                                                    ) : (
                                                        item?.inventoryNumber?.toString()
                                                    )}
                                                </td>
                                                <td className="w-96 text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <Select category={"appliance"} value={SAppliance} defaultChecked1={item.appliance}></Select>
                                                    ) : (
                                                        item.appliance
                                                    )}
                                                </td>
                                                <td className="w-96 text-center">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className="w-36"
                                                            type="text"
                                                            value={newName?.model || ""}
                                                            onChange={(e) =>
                                                                setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    model: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    ) : (
                                                        item.model
                                                    )}
                                                </td>
                                                <td className="w-52">
                                                    {editing && editing.id === item._id ? (
                                                        <input
                                                            className="w-36"
                                                            type="text"
                                                            value={newName?.notes || ""}
                                                            onChange={(e) =>
                                                                setNewName((prevState) => ({
                                                                    ...prevState,
                                                                    notes: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    ) : (
                                                        item.notes
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {item.event ? (<>
                                                            {item.event.name}

                                                        {session.user?.role ?
                                                            (<button className="bg-red-600 p-2 text-white m-1" onClick={() => handleDeleteEvent(item._id)}>X</button>) : (<></>)
                                                        }
                                                    </>) :
                                                        (<>
                                                            <EventDialog event={item.event} id={item._id} response={SResponse}></EventDialog>
                                                            <button
                                                                className="btn"
                                                                onClick={() => {
                                                                    const modal = document.getElementById('modal') as HTMLDialogElement;
                                                                    if (modal) {
                                                                        modal.showModal();
                                                                    }
                                                                }}
                                                            >
                                                                Add Event
                                                            </button>
                                                        </>)}
                                                </td>
                                            </tr >
                                            <tr>
                                                {details && details.id === item._id && (
                                                    <td colSpan={6}>
                                                        {Object.keys(data2).map((category) => (
                                                            <table key={category} className="w-full">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="w-48 text-green-800">Serial Number</th>
                                                                        <th className="w-48 text-green-800">Attributes</th>
                                                                        <th className="text-green-800">Log Date</th>
                                                                        <th className="text-green-800">Dates</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr key={data2[category]._id}>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (
                                                                                <input
                                                                                    className="w-36"
                                                                                    type="text"
                                                                                    value={newName?.serialNumber || ""}
                                                                                    onChange={(e) =>
                                                                                        setNewName((prevState) => ({
                                                                                            ...prevState,
                                                                                            serialNumber: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                data2[category].serialNumber
                                                                            )}
                                                                        </td>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <b>Location: </b>
                                                                                <Select category={"location"} value={SLocation} defaultChecked1={data2[category].location}></Select>
                                                                            </>) : (
                                                                                <>
                                                                                    <b>Location: </b> {data2[category].location}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                        <td className="w-96 text-center">
                                                                            <>
                                                                                <b>Creation Date: </b> {data2[category].createdAt}
                                                                            </>
                                                                        </td>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <b>Buy Date: </b>
                                                                                <input
                                                                                    className="w-36"
                                                                                    type="text"
                                                                                    value={newName?.buyDate.toString() || ""}
                                                                                    onChange={(e) =>
                                                                                        setNewName((prevState) => ({
                                                                                            ...prevState,
                                                                                            buyDate: e.target.valueAsDate,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </>) : (
                                                                                <>
                                                                                    <b>Buy Date: </b> {data2[category].buyDate}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="w-96 text-center"></td>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <b>Manufacturer: </b>
                                                                                <Select category={"manufacturer"} value={SManufacturer} defaultChecked1={data2[category].manufacturer}></Select>
                                                                            </>) : (
                                                                                <>
                                                                                    <b>Manufacturer: </b> {data2[category].manufacturer}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                        <td className="w-96 text-center">
                                                                            <>
                                                                                <b>Update Date: </b> {data2[category].updatedAt}
                                                                            </>
                                                                        </td>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <b>Guarantee Date: </b>
                                                                                <input
                                                                                    className="w-36"
                                                                                    type="text"
                                                                                    value={newName?.guaranteeDate.toString() || ""}
                                                                                    onChange={(e) =>
                                                                                        setNewName((prevState) => ({
                                                                                            ...prevState,
                                                                                            guaranteeDate: e.target.valueAsDate,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </>) : (
                                                                                <>
                                                                                    <b>Guarantee Date: </b> {data2[category].guaranteeDate}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="w-96 text-center"></td>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <b>Provider: </b>
                                                                                <Select category={"provider"} value={SProvider} defaultChecked1={data2[category].provider}></Select>
                                                                            </>) : (
                                                                                <>
                                                                                    <b>Provider: </b> {data2[category].provider}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                        <td className="w-96 text-center"></td>
                                                                        <td className="w-96 text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <b>Review Date: </b>
                                                                                <input
                                                                                    className="w-36"
                                                                                    type="text"
                                                                                    value={newName?.reviewDate.toString() || ""}
                                                                                    onChange={(e) =>
                                                                                        setNewName((prevState) => ({
                                                                                            ...prevState,
                                                                                            reviewDate: e.target.valueAsDate,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </>) : (
                                                                                <>
                                                                                    <b>Review Date: </b> {data2[category].reviewDate}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={4} className="text-center">
                                                                            {editing && editing.id === data2[category]._id ? (<>
                                                                                <button
                                                                                    onClick={handleUpdate}
                                                                                    className="mt-7 px-12 py-3 bg-green-500 hover:bg-green-600 text-white"
                                                                                >
                                                                                    Update
                                                                                </button>
                                                                                {error && (
                                                                                    <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
                                                                                )}
                                                                            </>) : (
                                                                                <>
                                                                                    <button
                                                                                        className="mt-7 px-12 py-3 bg-green-500 hover:bg-green-600 text-white"
                                                                                        onClick={() => handleEdit(category, {
                                                                                            ...data[category].find(item => item._id === data2[category]._id),
                                                                                            ...data2[category]
                                                                                        })}
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                    &nbsp;
                                                                                    <button
                                                                                        className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white"
                                                                                        onClick={() => handleDelete(category, data2[category]._id)}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        ))}
                                                    </td>
                                                )}
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}
