import { api } from "~/trpc/server";

const shadowBox = " shadow-[0_0_5px_0_rgba(0,0,0,.1)] ";

async function Funds() {
  const balances = await api.getAccountInfo.getAllBalance.query();
  return <div>{JSON.stringify(balances)}</div>;
}
export default Funds;
