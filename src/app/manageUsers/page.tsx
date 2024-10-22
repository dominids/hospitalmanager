import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserManagement from "@/components/ManageUsers";

export default async function Register(){
    const session = await getServerSession(authOptions);

    if(!session) redirect("/dashboard");

    return (
    <UserManagement/>
    )

}