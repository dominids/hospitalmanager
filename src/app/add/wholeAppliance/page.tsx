import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import FinalForm from "@/components/FinalForm";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/dashboard")

  return (
    <FinalForm></FinalForm>
  );
}