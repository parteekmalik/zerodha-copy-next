// layout.tsx
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import ContextLayer from "./page";

async function Page({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) redirect("/");
  console.log(session);

  return <ContextLayer>{children}</ContextLayer>;
}

export default Page;
