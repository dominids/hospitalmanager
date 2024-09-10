import { useState } from "react";
import Select from "./select";
import { useSession } from "next-auth/react";

type EventDialogProps = {
    event: {
        name?: string;
        endDate?: Date;
        eventDescription?: string;
    }
    id: string,
    response: Function
};


export default function EventDialog(props: EventDialogProps) {
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("Awaria");
    const [endDate, setEndDate] = useState<String>("");
    const [eventDescription, setEventDescription] = useState<string>("");

    function SEventName(v) {
        setName(v);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const id = props.id;
            const res = await fetch('/api/addEvent', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, name, endDate, eventDescription })
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                setError("");
                const modal = document.getElementById('modal') as HTMLDialogElement;
                if (modal) {
                    props.response(true);
                    modal.close();
                }
            } else {
                setIsSubmitting(false);
                setError("Registration failed");
            }
        } catch (error) {
            console.log(error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <dialog id="modal" className="modal">
            <div className=" modal-box">
                <h3 className="font-bold text-lg mb-3">Add event</h3>
                <form action="" className="" onSubmit={handleSubmit}>
                    <label>Name
                        {session.user?.role ? <>
                            <Select category={"event"} value={SEventName} defaultChecked1={"select"}></Select>
                            <label>End date
                                <input type="date" maxLength={30} minLength={3} className="mb-2 mt-2" onChange={(e) => setEndDate(e.target.value)} placeholder="End date" />
                            </label>
                        </> :
                            <select className="w-full p-3 text-ellipsis" >
                                <option value="Alert" defaultChecked>Awaria</option>
                            </select>
                        }
                    </label>
                    <label>Description
                        <input type="text" className="mb-2" onChange={(e) => setEventDescription(e.target.value)} placeholder="Description" />
                    </label>
                    <button disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Submit</button>
                    {error && (
                        <div className="bg-red-500 text-white text-sm w-fit py-1 px-3 rounded-md mt-2">{error}</div>
                    )}
                </form>
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
            </div>
        </dialog>
    );
}