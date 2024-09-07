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
      if (socket.readyState === socket.OPEN) {
        callback();
      } else {
        waitForSocketConnection(callback);
      }
    }, 1000);
  }

  waitForSocketConnection(() => {
    console.log("Socket sending message:", message);
    if (typeof message === "string") {
      socket.send(message);
    } else {
      socket.send(JSON.stringify(message));
    }
  });
}
function socketSend(socket: WebSocket, payload: Twsbinance) {
  payload.params = payload.params
    .map((item) => {
      const [first, second] = item.split("@");
      return first?.toLowerCase() + "@" + second;
    })
    .filter((i) => i !== "@trade");

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
        // console.log("redux-saga recieved message", data);
        if (data.result) {
          // console.log(typeof data.result, data.result);
          store.dispatch(updateBinanceWSSubsriptions(data.result));
        }
      } else {
        websocketService.reducer({
          action: "updateData",
          payload: { curPrice: data.p, symbol: data.s },
        });
      }
    };

  const subUnsubMddleware: Middleware = (store) => (next) => (action) => {
    const { type } = JSON.parse(JSON.stringify(action)) as {
      type: string;
    };
    if (!attachActions) {
      // websocket handlers
      socket.onmessage = onMessage(store);
      socket.onclose = onClose(store);
      socket.onopen = onOpen(store);
      attachActions = true;
    }
    let unsubparams: string[] = [];
    if (
      (type === "watchListType/updateWatchListNo" ||
        type === "watchListType/updateWatchList" ||
        type === "headerPinType/updateHeaderPin") &&
      socket
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
      (type === "watchListType/updateWatchListNo" ||
        type === "watchListType/updateWatchList" ||
        type === "headerPinType/updateHeaderPin") &&
      socket
    ) {
      const newState = store.getState() as RootState;
      const subparams = [
        ...(newState.watchList.List[newState.watchList.ListNo] ?? []),
        newState.headerPin.Pin0,
        newState.headerPin.Pin1,
      ].map((i) => i + "@trade");

      const common = subparams.filter((x) => unsubparams.includes(x));
      const subMsg: Twsbinance = {
        method: "SUBSCRIBE",
        params: subparams.filter((i) => !common.includes(i)),
        id: 1,
      };
      socketSend(socket, subMsg);
      const unsubMsg: Twsbinance = {
        method: "UNSUBSCRIBE",
        params: unsubparams.filter((i) => !common.includes(i)),
        id: 2,
      };
      socketSend(socket, unsubMsg);
      if (unsubMsg.params.length || subMsg.params.length)
        sendWSBinanceMessage(
          socket,
          JSON.stringify({ method: "LIST_SUBSCRIPTIONS", id: 3 }),
        );
    }
  };
  return subUnsubMddleware;
};

export default setupSocket;
