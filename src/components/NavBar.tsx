"use client"
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";



export default function NavBar({ children }) {
    const { data: session } = useSession();

    const[Icon, setIcon] = useState(false);
    const[listState, setListState] = useState(false);

    const toggleClass = () => {
        setIcon(!Icon);
    };

    const toggleListState = () => {
        setListState(!listState);
    };

    return (<>
        <div className="container flex flex-col">
            {session ? (<>
            <ul className="flex flex-row flex-wrap justify-between text-base">
                <li className="px-1 py-2 flex">
                    <div className={Icon ? 'change w-9' : 'w-9'} onClick={()=>{
                        toggleClass();
                        toggleListState();
                        }}>
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                    <Link href={'/dashboard'}>
                        Hospital manager <span className="font-bold">{session?.user?.role}</span>
                    </Link>
                </li>
                <li className=" py-2">
                    SearchBar
                </li>
                <li>
                    <span className="font-bold mr-2">Name: {session?.user?.name} </span>
                    <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-2">Log Out</button>
                </li>
            </ul>
            <div className="flex flex-row">
                <div className={listState ? 'w-56 mr-1' : 'hidden'}>
                    <ul>
                        <li className="px-2 select-none">&nbsp;</li>
                        <li className="hover:bg-teal-200 px-2 bg-teal-100 font-bold">New whole appliance</li>
                        <hr className="border border-black border-solid"></hr>
                        <ul>
                            <li className=" bg-teal-100 font-bold px-2">ADD NEW</li>
                            <li className="hover:bg-zinc-200 px-2 bg-teal-50">Appliance</li>
                            <li className="hover:bg-zinc-200 px-2 bg-teal-50">Event</li>
                            <li className="hover:bg-zinc-200 px-2 bg-teal-50">Location</li>
                            <li className="hover:bg-zinc-200 px-2 bg-teal-50">Provider</li>
                        </ul>
                        <hr className="border border-black border-solid"></hr>
                        <li className="hover:bg-teal-200 px-2 bg-teal-100 font-bold">Set New Admin</li>
                    </ul>
                </div>
                <div className=" flex-grow">
                    {children}
                </div>
            </div>
            </>) : children}
        </div>
    </>)
}