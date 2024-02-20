import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import ContextLayer from "./contetLayer";

async function page() {
  const watchListData = await api.accountInfo.watchList.query();
  const session = await getServerAuthSession();


  return <ContextLayer watchlist={watchListData} userDetails={session?.user} />;
}

export default page;
