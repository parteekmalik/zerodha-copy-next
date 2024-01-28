// const url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"

// const getupdate = async () => {
//   const res = await axios.get(url);
//   console.log(res.data);
// };
// const interval = setInterval(getupdate, 100);

const wsurl = "wss:/stream.binance.us:9443";

const express = require("express");
const app = express();
const port = 5000;
const WebSocket = require("ws");

const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws");

binanceSocket.onmessage = function (event) {
  const messageObject = JSON.parse(event.data);
  // $("." + messageObject[0].s).html(messageObject[0].c);
  console.log(messageObject);
  // console.log(event);
  // messageObject.forEach(function (item, index) {
  //   if (item.s === "BTCUSDT") {
  //     let btcValue = parseFloat(item.c);
  //     console.log(item);
  //     // $("#btcValue").html("BTC: $" + btcValue.toFixed(2));
  //   }
  // });
};
binanceSocket.onopen = () => {
  console.log("connected");
  const msg = {
    method: "SUBSCRIBE",
    params: ["xrpusdt@trade", "ltcusdt@trade"],
    id: 1,
  };

  binanceSocket.send(JSON.stringify(msg));
  binanceSocket.send(
    JSON.stringify({
      method: "LIST_SUBSCRIPTIONS",
      id: 3,
    }),
  );
};
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
