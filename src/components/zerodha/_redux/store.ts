import { configureStore } from "@reduxjs/toolkit";
import BinanceWSStatsReducer from "./Slices/BinanceWSStats";
import FormDataReducer from "./Slices/FormData";
import headerPinReducer from "./Slices/headerPin";
import ordersReducer from "./Slices/orders";
import symbolsListReducer from "./Slices/symbolsList";
import userInfoReducer from "./Slices/userInfo";
import watchListReducer from "./Slices/watchList";
import DeviceTypeReducer from "./Slices/DeviceType";
import setupSocket from "./middlewares/Bnance/socket";
import subsciptionsMddleware from "./middlewares/subsciptions";
import { env } from "~/env";
import FormMddleware from "./middlewares/form";

const middleware = [
  setupSocket(env.NEXT_PUBLIC_BINANCE_WS),
  subsciptionsMddleware,
  FormMddleware
];
export const store = configureStore({
  reducer: {
    UserInfo: userInfoReducer,
    FormData: FormDataReducer,
    headerPin: headerPinReducer,
    orders: ordersReducer,
    watchList: watchListReducer,
    symbolsList: symbolsListReducer,
    BinanceWSStats: BinanceWSStatsReducer,
    DeviceType: DeviceTypeReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
