import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Form from "@/components/Form";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/dashboard")

  return (
    <Form direction={"event"}></Form>
  );
}