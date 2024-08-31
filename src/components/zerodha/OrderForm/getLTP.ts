import axios from "axios";
import { env } from "~/env";
// TODO:do better error handling
async function getLTP(symbol: string) {
  symbol = symbol.toUpperCase();
  if (symbol.slice(-4) !== "USDT") symbol += "USDT";
  const url = env.BINANCE_LTP_URL + symbol;
  const res = (await axios.get(url)).data as { symbol: string; price: string };
  console.log("getLTP " + symbol + " -> ", res);
  return Number(res.price);
}
export default getLTP;
