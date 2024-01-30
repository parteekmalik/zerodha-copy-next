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

const x= {
  "e": "24hrTicker",
  "E": 1706599788796,
  "s": "BARUSDT",
  "p": "0.73600000",
  "P": "30.338",
  "w": "2.90217134",
  "x": "2.42500000",
  "c": "3.16200000",
  "Q": "166.57000000",
  "b": "3.15700000",
  "B": "3.57000000",
  "a": "3.16300000",
  "A": "30.00000000",
  "o": "2.42600000",
  "h": "3.31500000",
  "l": "2.41100000",
  "v": "4434337.31000000",
  "q": "12869206.64439000",
  "O": 1706513388795,
  "C": 1706599788795,
  "F": 12031999,
  "L": 12102470,
  "n": 70472
}