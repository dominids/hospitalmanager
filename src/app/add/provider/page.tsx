import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Form2 from "@/components/Form2";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/dashboard")

  return (
    <Form2></Form2>
  );
}