import {
  updateBinanceWSStats,
  updateBinanceWSSubsriptions,
} from "../../Slices/BinanceWSStats";
import { updateLivestream } from "../../Slices/Livestream";
import { store } from "../../store";

export type TsymbolTrade = {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
  M: boolean;
};
export type WS_method = "SUBSCRIBE" | "UNSUBSCRIBE";
export type Twsbinance = {
  method: WS_method;
  params: string[];
  id: number;
};
const setupSocket = (dispatch: typeof store.dispatch, url: string) => {
  const socket = new WebSocket(url);
  socket.onclose = () => {
    dispatch(updateBinanceWSStats(false));
  };
  socket.onopen = () => {
    console.log("redux-saga connected websocket to binance");
    dispatch(updateBinanceWSStats(true));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data as string) as
      | TsymbolTrade
      | { result: string[]; id: number };
    if ("result" in data) {
      console.log("redux-saga recieved message", data);
      if (data.result) {
        console.log(typeof data.result, data.result);
        dispatch(updateBinanceWSSubsriptions(data.result));
      }
    } else {
      dispatch(updateLivestream({ curPrice: data.p, symbol: data.s }));
    }
  };
  return socket;
};

export default setupSocket;
