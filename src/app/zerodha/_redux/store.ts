import { Middleware, configureStore } from "@reduxjs/toolkit";
import BinanceWSStatsReducer from "./Slices/BinanceWSStats";
import FormDataReducer from "./Slices/FormData";
import LivestreamReducer, { update_Last24hrdata } from "./Slices/Livestream";
import headerPinReducer, { TheaderPinType } from "./Slices/headerPin";
import ordersReducer from "./Slices/orders";
import rightSideReducer from "./Slices/rightSideData";
import symbolsListReducer from "./Slices/symbolsList";
import userInfoReducer from "./Slices/userInfo";
import watchListReducer from "./Slices/watchList";
import setupSocket, { Twsbinance } from "./sagas/Bnance/socket";
import { News_Cycle } from "next/font/google";

const subsciptionsMddleware: Middleware = (Store) => (next) => (action) => {
  next(action);
  const { type } = JSON.parse(JSON.stringify(action)) as { type: string };

  if (type === "BinanceWSStatsType/updateBinanceWSSubsriptions") {
    const newState = Store.getState() as RootState;
    console.log("dispatch from middleware");
    store
      .dispatch(update_Last24hrdata(newState.BinanceWSStats.subsciptions))
      .catch((err) => console.log(err));
  }
};

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
export const store = configureStore({
  reducer: {
    UserInfo: userInfoReducer,
    rightSide: rightSideReducer,
    FormData: FormDataReducer,
    headerPin: headerPinReducer,
    orders: ordersReducer,
    watchList: watchListReducer,
    symbolsList: symbolsListReducer,
    Livestream: LivestreamReducer,
    BinanceWSStats: BinanceWSStatsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(subUnsubMddleware)
      .concat(subsciptionsMddleware),
});
const socket = setupSocket(store.dispatch, "wss://stream.binance.com:9443/ws");

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
