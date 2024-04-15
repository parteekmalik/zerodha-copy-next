import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
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

const sagaMiddleware = createSagaMiddleware();

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
  middleware(getDefaultMiddleware) {
    console.log(getDefaultMiddleware());
    return getDefaultMiddleware().concat(sagaMiddleware);
  },
  // enhancers: [
  //   composeWithDevTools({
  //     serialize: {
  //       // Filter actions based on specific conditions
  //       actionSanitizer: (action) =>
  //         action.type.startsWith("SOMETHING") ? action : null,
  //     },
  //   }),
  // ],
});
const socket = setupSocket(store.dispatch, "wss://stream.binance.com:9443/ws");

const sendWSBinanceMessage = (message: Twsbinance) => {
  console.log("sendWSBinanceMessage");
  socket.send(JSON.stringify(message));
  const listSubReq = { method: "LIST_SUBSCRIPTIONS", id: 3 };
  setTimeout(() => socket.send(JSON.stringify(listSubReq)), 500);
};

// sagaMiddleware.run(handleNewMessage, { socket });
//
// export type pramsForSagaMiddleware = {
//   socket: typeof socket;
// };

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
