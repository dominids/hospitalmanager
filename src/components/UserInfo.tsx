"use client"

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo(){

    const {data: session} = useSession();

    return (
    <div className="">
        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
            <div>
                <span className="font-bold">User <br /> </span>
                Widzę sprzęt | tabela | sortowanie | searchbar |dodaj zdarzenie(onClick)
            </div>

            {session?.user?.role && (
            <div>
                <span className="font-bold"> Admin <br /> </span>
                Dodaj nowe zdarzenie | Urządzenie | Producent | Lokalizacja | Dostawca | 
            </div>
            )}
            <div>
                Edycja
            </div>
            <div>
                Dodaj nowy sprzęt
            </div>
            <div>
                Name: <span className="font-bold">{session?.user?.name}</span>
            </div>
            <div>
                Email: <span className="font-bold">{session?.user?.email}</span>
            </div>
            <div>
                Rola: <span className="font-bold"> {session?.user?.role}</span>
                </div>
        </div>
    </div>
)
}