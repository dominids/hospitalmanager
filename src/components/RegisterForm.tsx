"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); //for routing do index after register

  const handleSubmit = async (e) => {
    e.preventDefault(); //check if it's not default

    //check if any of the values are blank
    if (!name || !email || !password) {
      setError("All Fields are necessary.");
      return;
    }
    
    try {
      //check if user exists 
      const resUserExists = await fetch('api/userExists', {
        method: "POST", //method in api
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), //stringify converts value to json
      })

      const { user } = await resUserExists.json(); //pass the searched result and asign to user
      //if user is not null return an error and exit the function
      if (user) {
        setError("User already exists");
        return;
      }

      //if user is not in the database we register 
      const res = await fetch('api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application-json"
        },
        body: JSON.stringify({
          name, email, password
        })
      });

      //if the querry is ok then we reset the form
      if (res.ok) {
        const form = e.target;
        form.reset();
        setError("");
        router.push("/");

      } else {
        setError("User registration failed");
      }
    } catch (error) {
      console.log("Error during the registration", error)
    }
  }

  return (<>
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
          <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button onSubmit={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer px-6 py-2"> Register </button>
          {error && (
            <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
          )}
          <Link href={'/'} className="text-sm mt-3 text-right">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  </>);
}