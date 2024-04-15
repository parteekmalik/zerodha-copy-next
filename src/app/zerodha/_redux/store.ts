import { configureStore } from "@reduxjs/toolkit";
import BinanceWSStatsReducer from "./Slices/BinanceWSStats";
import FormDataReducer from "./Slices/FormData";
import LivestreamReducer from "./Slices/Livestream";
import headerPinReducer from "./Slices/headerPin";
import ordersReducer from "./Slices/orders";
import rightSideReducer from "./Slices/rightSideData";
import symbolsListReducer from "./Slices/symbolsList";
import userInfoReducer from "./Slices/userInfo";
import watchListReducer from "./Slices/watchList";
import setupSocket, { Twsbinance } from "./sagas/Bnance/socket";

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
});
const socket = setupSocket(store.dispatch, "wss://stream.binance.com:9443/ws");

const sendWSBinanceMessage = (message: Twsbinance) => {
  console.log("sendWSBinanceMessage");
  socket.send(JSON.stringify(message));
  const listSubReq = { method: "LIST_SUBSCRIPTIONS", id: 3 };
  setTimeout(() => socket.send(JSON.stringify(listSubReq)), 500);
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function socketSend(payload: Twsbinance) {
  payload.params = payload.params.map((item) => {
    const [first, second] = item.split("@");
    return first?.toLowerCase() + "@" + second;
  });

  // if (payload.method === "UNSUBSCRIBE") {
  //   payload.params = payload.params.filter(
  //     (item) =>
  //       item === headerPin.Pin0 + "@trade" &&
  //       item === headerPin.Pin1 + "@trade",
  //   );
  //   // console.log("remove pins from unsubscribe ->", payload);
  // }
  if (payload.params.length) sendWSBinanceMessage(payload);
}
