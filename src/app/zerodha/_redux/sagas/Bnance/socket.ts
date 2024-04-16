"use client";
import { Middleware } from "redux";
import {
  updateBinanceWSStats,
  updateBinanceWSSubsriptions,
} from "../../Slices/BinanceWSStats";
import { updateLivestream } from "../../Slices/Livestream";
import { RootState, store } from "../../store";

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
const setupSocket = (url: string) => {
  const socket = new WebSocket(url);
  socket.onclose = () => {
    store.dispatch(updateBinanceWSStats(false));
  };
  socket.onopen = () => {
    console.log("redux-saga connected websocket to binance");
    store.dispatch(updateBinanceWSStats(true));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data as string) as
      | TsymbolTrade
      | { result: string[]; id: number };
    if ("result" in data) {
      console.log("redux-saga recieved message", data);
      if (data.result) {
        console.log(typeof data.result, data.result);
        store.dispatch(updateBinanceWSSubsriptions(data.result));
      }
    } else {
      store.dispatch(updateLivestream({ curPrice: data.p, symbol: data.s }));
    }
  };
  function sendWSBinanceMessage(message: Twsbinance) {
    while (socket.readyState !== 1) {}
    console.log("socket sendingmessage", message);
    socket.send(JSON.stringify(message));
  }

  function socketSend(payload: Twsbinance) {
    payload.params = payload.params
      .map((item) => {
        const [first, second] = item.split("@");
        return first?.toLowerCase() + "@" + second;
      })
      .filter((i) => i !== "@trade");

    if (payload.params.length) sendWSBinanceMessage(payload);
  }
  const subUnsubMddleware: Middleware = (store) => (next) => (action) => {
    const { type } = JSON.parse(JSON.stringify(action)) as { type: string };
    let unsubparams: string[] = [];
    if (
      type === "watchListType/updateWatchListNo" ||
      type === "watchListType/updateWatchList" ||
      type === "headerPinType/updateHeaderPin"
    ) {
      const oldState = store.getState() as RootState;
      unsubparams = [
        ...(oldState.watchList.List[oldState.watchList.ListNo] ?? []),
        oldState.headerPin.Pin0,
        oldState.headerPin.Pin1,
      ].map((i) => i + "@trade");
    }
    next(action);

    if (
      type === "watchListType/updateWatchListNo" ||
      type === "watchListType/updateWatchList" ||
      type === "headerPinType/updateHeaderPin"
    ) {
      const newState = store.getState() as RootState;
      const subparams = [
        ...(newState.watchList.List[newState.watchList.ListNo] ?? []),
        newState.headerPin.Pin0,
        newState.headerPin.Pin1,
      ].map((i) => i + "@trade");

      const common = subparams.filter((x) => unsubparams.includes(x));
      socketSend({
        method: "SUBSCRIBE",
        params: subparams.filter((i) => !common.includes(i)),
        id: 1,
      });
      socketSend({
        method: "UNSUBSCRIBE",
        params: unsubparams.filter((i) => !common.includes(i)),
        id: 1,
      });
      socket.send(JSON.stringify({ method: "LIST_SUBSCRIPTIONS", id: 3 }));
    }
  };
  return subUnsubMddleware;
};

export default setupSocket;
