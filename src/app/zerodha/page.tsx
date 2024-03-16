import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import ContextLayer from "./contetLayer";

async function Page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  return <ContextLayer isLogedin={session ? true : false} />;
}

export default Page;
