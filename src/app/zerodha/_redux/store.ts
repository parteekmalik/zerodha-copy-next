"use client";
import { Middleware, configureStore } from "@reduxjs/toolkit";
import BinanceWSStatsReducer, {
  updateBinanceWSStats,
} from "./Slices/BinanceWSStats";
import FormDataReducer from "./Slices/FormData";
import LivestreamReducer, { update_Last24hrdata } from "./Slices/Livestream";
import headerPinReducer from "./Slices/headerPin";
import ordersReducer from "./Slices/orders";
import rightSideReducer from "./Slices/rightSideData";
import symbolsListReducer from "./Slices/symbolsList";
import userInfoReducer from "./Slices/userInfo";
import watchListReducer from "./Slices/watchList";
import setupSocket, { Twsbinance } from "./sagas/Bnance/socket";

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
      .concat(setupSocket("wss://stream.binance.com:9443/ws"))
      .concat(subsciptionsMddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
