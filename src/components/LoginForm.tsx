"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); //for routing do index after register


  const handleSubmit =  async(e) =>{
    e.preventDefault(); //check if it's not default
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email,password, redirect: false
      });
      setIsSubmitting(false);
      
      if(res.error) {
        setError("Indvalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error)
    }
  }

  return (<>
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4 to-black">Login</h1>

        <form action="" className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold cursor-pointer px-6 py-2">Log in</button>

          { error && (
          <div className="bg-red-500 text-white text-sm w-fit py-1 px3 rounded-md mt-2">{error}</div>
          )}
          <Link href={'/register'} className="text-sm mt-3 text-right">
            Dont have an account?<span className="underline">Register</span>
          </Link>
        </form>
      </div>

    </div>
  </>);
}

