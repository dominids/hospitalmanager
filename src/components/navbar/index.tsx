"use client"
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { ListIcon } from "./ListIcon";
import MenuList from "./MenuList";

export default function Navbar({ children }) {
    const { data: session } = useSession();
    const [listState, setListState] = useState(false);
    return (<>
        {session ? (<>
            <div className="container flex flex-col">
                <ul className="flex flex-row flex-wrap justify-between text-base">
                    <li className="px-1 py-2 flex">
                        {session?.user?.role ? <ListIcon listState={listState} setListState={setListState} /> : null}
                        <Link href={'/dashboard'}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-500">Hospital manager </span><span className="font-bold">{session?.user?.role}</span>
                        </Link>
                    </li>
                    <li>
                        <span className="font-bold mr-2">Name: {session?.user?.name} </span>
                        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-2">Log Out</button>
                    </li>
                </ul>
                <div className="flex flex-row">
                    <div className={listState ? 'w-60 mr-1' : 'hidden'}>
                        <MenuList/>
                    </div>
                    <div className="flex-grow">
                        {children}
                    </div>
                </div>
                <footer className="text-center w">
                    <p>Creator of the page: Dominik Kłyszyński</p>
                </footer>
            </div>
        </>) : children}
    </>)
}  