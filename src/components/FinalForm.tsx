"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function FinalForm(props) {
    const { data: session } = useSession();
    if (!session) redirect("/dashboard")

    const [appliance, setAppliance] = useState("");
    const [inventoryNumber, setInventoryNumber] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [provider, setProvider] = useState("");
    const [model, setModel] = useState("");
    const [location, setLocation] = useState("");
    const [buyDate, setBuyDate] = useState("");
    const [guaranteeDate, setGuaranteeDate] = useState("");
    const [reviewDate, setReviewDate] = useState("");
    const [worth, setWorth] = useState("");
    const [notes, setNotes] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const src = "New Appliance";

    const handleSubmit = async (e) => {
        if (!session?.user?.role) redirect("/dashboard")
        e.preventDefault(); //check if it's not default
        setIsSubmitting(true);

        if (appliance=="select#123456789" || !inventoryNumber || !serialNumber || manufacturer=="select#123456789" || provider=="select#123456789" ||
            !model || location=="select#123456789" || !buyDate || !guaranteeDate || !reviewDate || worth=="zł") {
            setError("All fields are mandatory");
            setIsSubmitting(false);
            return;
        }
        try {

            //check if exists 
            const resNameExists = await fetch('/api/check3', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inventoryNumber }) //stringify converts value to json
            })

            const { payload } = await resNameExists.json();
            if (payload) {
                setError(`Appliance already exist`);
                setIsSubmitting(false);
                return;
            }
            //creating the appliance
            console.log(appliance,inventoryNumber,serialNumber,manufacturer,provider,model,location,buyDate,guaranteeDate,reviewDate,worth,notes);
            const res = await fetch('/api/fetch2', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    appliance,inventoryNumber,serialNumber,manufacturer,provider,model,location,buyDate,guaranteeDate,reviewDate,worth,notes
                })
            });


            //if the query is ok then we reset the form
            if (res.ok) {
                const form = e.target;
                form.reset();
                setError("");
                setInventoryNumber("");
                setSerialNumber("");
                setAppliance("");
                setModel("");
                setManufacturer("");
                setProvider("");
                setBuyDate("");
                setGuaranteeDate("");
                setReviewDate("");
                setWorth("");
                setLocation("");
                setNotes("");
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
            <h1 className="text-xl font-bold my-4 to-black">Add new Appliance</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className="flex flex-row flex-wrap gap-3 justify-center">
                    <label>
                        Inventory Number
                        <input type="number" maxLength={60} minLength={3} className="mr-2 w-full" onChange={(e) => setInventoryNumber(e.target.value)} />
                    </label>
                    <label>
                        Serial Number
                        <input type="text" maxLength={60} minLength={3} className="mr-2 w-full" onChange={(e) => setSerialNumber(e.target.value)} />
                    </label>
                    <label>
                        Appliance name
                        <select className="w-full p-3 text-ellipsis" onChange={(e) => setAppliance(e.target.value)}>
                            <option value="select#123456789">select</option>
                            <option value="kukle">kuklekuklekuklekuklekuklekukle</option>
                        </select>
                    </label>
                    <label>
                        Model
                        <input type="text" maxLength={30} minLength={3} className="mr-2 w-full" onChange={(e) => setModel(e.target.value)} />
                    </label>
                    <label>
                        Manufacturer
                        <select className="w-full p-3 text-ellipsis" onChange={(e) => { setManufacturer(e.target.value); console.log(e.target.value) }}>
                            <option value="select#123456789">select</option>
                            <option value="kukle">kuklekuklekuklekuklekuklekukle</option>
                        </select>
                    </label>
                    <label>
                        Provider
                        <select className="w-full p-3 text-ellipsis" onChange={(e) => setProvider(e.target.value)}>
                            <option value="select#123456789">select</option>
                            <option value="kukle">kuklekuklekuklekuklekuklekukle</option>
                        </select>
                    </label>
                    <label>
                        Buy Date
                        <input type="date" className="mr-2 w-full" onChange={(e) => setBuyDate(e.target.value)} />
                    </label>
                    <label>
                        Guarantee Date
                        <input type="date" className="mr-2 w-full" onChange={(e) => setGuaranteeDate(e.target.value)} />
                    </label>
                    <label>
                        Review Date
                        <input type="date" className="mr-2 w-full" onChange={(e) => setReviewDate(e.target.value)} />
                    </label>
                    <label>
                        Worth
                        <input type="text" defaultValue={"zł"} maxLength={30} minLength={3} className="mr-2 w-full" onChange={(e) => setWorth(e.target.value)} />
                    </label>
                    <label>
                        Location
                        <select className="w-full p-3 text-ellipsis" onChange={(e) => setLocation(e.target.value)}>
                            <option value="select#123456789">select</option>
                            <option value="kukle">kuklekuklekuklekuklekuklekukle</option>
                        </select>
                    </label>
                </div>
                <label>
                    Notes
                    <textarea name="" id="" className="mr-2 w-full resize-none h-47" onChange={(e) => setNotes(e.target.value)}></textarea>
                </label>
                <div className="flex justify-center flex-col items-center mt-10">
                    <button disabled={isSubmitting} className="w-40 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Submit</button>
                    {error && (
                        <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
                    )}
                </div>
            </form>
        </div>
    );
}