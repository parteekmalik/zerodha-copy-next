"use client";
import {
  AnyAction,
  Middleware,
  ThunkMiddleware,
  UnknownAction,
  configureStore,
} from "@reduxjs/toolkit";
import BinanceWSStatsReducer from "./Slices/BinanceWSStats";
import FormDataReducer from "./Slices/FormData";
import LivestreamReducer, { update_Last24hrdata } from "./Slices/Livestream";
import headerPinReducer from "./Slices/headerPin";
import ordersReducer from "./Slices/orders";
import rightSideReducer from "./Slices/rightSideData";
import symbolsListReducer from "./Slices/symbolsList";
import userInfoReducer from "./Slices/userInfo";
import watchListReducer from "./Slices/watchList";
import setupSocket from "./middlewares/Bnance/socket";

const subsciptionsMddleware: ThunkMiddleware =
  (Store) => (next) => (action) => {
    next(action);
    const { type } = JSON.parse(JSON.stringify(action)) as { type: string };

    if (type === "BinanceWSStatsType/updateBinanceWSSubsriptions") {
      const newState = Store.getState() as RootState;
      Store.dispatch(update_Last24hrdata(newState.BinanceWSStats.subsciptions)).catch(err=>console.log(err));
    }
  };
const middleware = [setupSocket(), subsciptionsMddleware];
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
    return getDefaultMiddleware().concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
