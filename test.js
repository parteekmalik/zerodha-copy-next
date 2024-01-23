import axios from "axios";

const url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"

const getupdate = async () => {
  const res = await axios.get(url);
  console.log(res.data);
};
const interval = setInterval(getupdate, 100);
