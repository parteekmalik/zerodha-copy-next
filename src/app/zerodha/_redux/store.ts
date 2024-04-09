import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfo/userInfo";
import rightSideReducer from "./rightSideData/rightSideData";
import FormDataReducer from "./FormData/FormData";
import headerPinReducer from "./headerPin/headerPin";
import ordersReducer from "./orders/orders";
import watchListReducer from "./watchList/watchList";
import symbolsListReducer from "./symbolsList/symbolsList";
import LivestreamReducer from "./Livestream/Livestream";

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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
