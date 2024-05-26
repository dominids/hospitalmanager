"use client"
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";



export default function NavBar() {
    const {data: session} = useSession();

    return (
        <div>
            <ul className="flex flex-row flex-wrap justify-between text-base">  
                    <li className="px-1 py-2 ">
                        <Link href={'/dashboard'}>
                            Hospital manager <span className="font-bold ">{session?.user?.role}</span>
                        </Link>
                    </li>
                    <li className="px-6 py-2">
                        SearchBar
                    </li>
                    <li>
                        <span className="font-bold mr-10">Name: {session?.user?.name} </span>
                        <button onClick={()=>signOut()} className="bg-red-500 text-white font-bold px-6 py-2">Log Out</button>
                    </li>
            </ul>
        </div>
    )
}