"use client"

import { useState } from "react";

export default function Form(props) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault(); //check if it's not default
        setIsSubmitting(true);

        if (!name) {
            setError("Name can't be blank");
            setIsSubmitting(false);
            return;
        }
        try {
            const src=props.direction;
            
            //check if user exists 
            const resNameExists = await fetch('http://localhost:3000/api/check', {
                method: "POST", //method in api
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({src, name}) //stringify converts value to json
            })
            
            const { payload } = await resNameExists.json(); //pass the searched result and asign to user
            //if user is not null return an error and exit the function
            if (payload) {
                setError(`${src} already exist`);
                setIsSubmitting(false);
                return;
            }
            
            //if user is not in the database we register 
            const res = await fetch('http://localhost:3000/api/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application-json"
                },
                body: JSON.stringify({
                    src,
                    name
                })
            });


            //if the querry is ok then we reset the form
            if (res.ok) {
                const form = e.target;
                form.reset();
                setError("");

            } else {
                setError("Registration failed");
            }
            setIsSubmitting(false);
        } catch (error) {
            console.log(error.message)
        }
    }
    return (<>
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6 h-screen items-center">
            <h1 className="text-xl font-bold my-4 to-black">Add {props.direction}</h1>
            <form action="" className="" onSubmit={handleSubmit}>
                <input type="text" className="mr-2" onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <button disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Submit</button>

                {error && (
                    <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
                )}
            </form>
            <div>
                Widzę sprzęt | tabela | sortowanie | searchbar |dodaj zdarzenie(onClick)
            </div>
        </div>
    </>);
}