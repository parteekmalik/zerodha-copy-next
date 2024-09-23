import { Dispatch, Middleware, MiddlewareAPI, UnknownAction } from "redux";
import { websocketService } from "~/components/zerodha/_contexts/LiveData/BinanceWSContextComponent";
import {
  updateBinanceWSStats,
  updateBinanceWSSubsriptions,
} from "../../Slices/BinanceWSStats";
import { RootState } from "../../store";

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

function sendWSBinanceMessage(socket: WebSocket, message: Twsbinance | string) {
  function waitForSocketConnection(callback: () => void) {
    setTimeout(() => {
      if (socket.readyState === socket.OPEN) callback();
      else waitForSocketConnection(callback);
    }, 1000);
  }

  waitForSocketConnection(() => {
    // console.log("Socket sending message:", message);
    if (typeof message === "string") socket.send(message);
    else socket.send(JSON.stringify(message));
  });
}
function socketSend(socket: WebSocket, payload: Twsbinance) {
  payload.params = Array.from(new Set(payload.params));
  if (payload.params.length) sendWSBinanceMessage(socket, payload);
}

const setupSocket = (url: string) => {
  const socket: WebSocket = new WebSocket(url);
  let attachActions = false;
  const onClose =
    (store: MiddlewareAPI<Dispatch<UnknownAction>, unknown>) => () => {
      store.dispatch(updateBinanceWSStats(false));
    };
  const onOpen =
    (store: MiddlewareAPI<Dispatch<UnknownAction>, unknown>) => () => {
      console.log("redux-middleware connected websocket to binance");
      store.dispatch(updateBinanceWSStats(true));
    };
  const onMessage =
    (store: MiddlewareAPI<Dispatch<UnknownAction>, unknown>) =>
    (event: { data: string }) => {
      const data = JSON.parse(event.data) as
        | TsymbolTrade
        | { result: string[]; id: number };
      if ("result" in data) {
        if (data.result)
          store.dispatch(updateBinanceWSSubsriptions(data.result));
      } else {
        websocketService.reducer({
          action: "updateData",
          payload: { curPrice: data.p, symbol: data.s },
        });
      }
    };
  const subAndUnsubTimeOut: {
    sub: NodeJS.Timeout | null;
    unsub: NodeJS.Timeout | null;
    list: NodeJS.Timeout | null;
  } = {
    sub: null,
    unsub: null,
    list: null,
  };
  const subUnsubMddleware: Middleware = (store) => (next) => (action) => {
    const { type, payload } = JSON.parse(JSON.stringify(action)) as {
      type: string;
      payload: unknown;
    };
    if (!attachActions) {
      // websocket handlers
      socket.onmessage = onMessage(store);
      socket.onclose = onClose(store);
      socket.onopen = onOpen(store);
      attachActions = true;
    }
    next(action);
    if (type === "BinanceWSStatsType/updateSeprateSubscriptions") {
      const newState = store.getState() as RootState;
      const prevSubs = newState.BinanceWSStats.subsciptions;
      const newSubs = Object.values(
        newState.BinanceWSStats.seprateSubscriptions,
      )
        .flat()
        .filter((i) => i !== "")
        .map((i) => SymbolsConvertor(i));

      const common = prevSubs.filter((x) => newSubs.includes(x));
      const subMsg: Twsbinance = {
        method: "SUBSCRIBE",
        params: newSubs.filter((i) => !common.includes(i)),
        id: 1,
      };
      if (subAndUnsubTimeOut.sub) clearTimeout(subAndUnsubTimeOut.sub);
      subAndUnsubTimeOut.sub = setTimeout(
        () => socketSend(socket, subMsg),
        1000,
      );
      const unsubMsg: Twsbinance = {
        method: "UNSUBSCRIBE",
        params: prevSubs.filter((i) => !common.includes(i)),
        id: 2,
      };
      if (subAndUnsubTimeOut.unsub) clearTimeout(subAndUnsubTimeOut.unsub);
      subAndUnsubTimeOut.unsub = setTimeout(
        () => socketSend(socket, unsubMsg),
        1500,
      );

      if (unsubMsg.params.length || subMsg.params.length) {
        if (subAndUnsubTimeOut.list) clearTimeout(subAndUnsubTimeOut.list);
        subAndUnsubTimeOut.list = setTimeout(() => {
          sendWSBinanceMessage(
            socket,
            JSON.stringify({ method: "LIST_SUBSCRIPTIONS", id: 3 }),
          );
        }, 2000);
      }
    }
  };
  return subUnsubMddleware;
};

function SymbolsConvertor(symbol: string) {
  symbol = symbol.toLowerCase();
  let [first] = symbol.split("@");
  const [_, second] = symbol.split("@");
  if (first && !first.endsWith("usdt")) first += "usdt";
  return (first ?? "") + (second ?? "@trade");
}

export default setupSocket;
