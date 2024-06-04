"use client"

import { useSession } from "next-auth/react";

export default function Dash(){

    const {data: session} = useSession();

    return (
        <></>
)
}