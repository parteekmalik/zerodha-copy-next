import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import ContextLayer from "./contetLayer";

async function page() {
  return <ContextLayer />;
}

export default page;
