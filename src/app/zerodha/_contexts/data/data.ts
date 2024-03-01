import { createContext } from "react";
import type { TorderForm } from "../../_components/OrderForm/orderForm";
import type { Tsymbol } from "../../_components/WatchList/watchList";
import type { IdataContextActions } from "./dataReduer";

export type TrightSideType =
  | { type: "Dashboard" }
  | { type: "Orders" }
  | { type: "Holdings" }
  | { type: "Positions" }
  | { type: "Bids" }
  | { type: "Funds" }
  | {
      type: "chart";
      symbol: string;
      TimeFrame: string;
    };

export type TuserDetails =
  | ({
      id: string;
    } & {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    })
  | undefined;

export interface IdataContextState {
  rightSideData: TrightSideType;
  watchList: Tsymbol[][];
  userDetails: TuserDetails;
  headerPin: TPin;
  FormData: TorderForm;
}
export type TPin = { Pin0: string; Pin1: string };
export const defaultdataContextState: IdataContextState = {
  rightSideData: { type: "Dashboard" },
  watchList: [],
  userDetails: {
    name: "not_found",
    email: "not_found@gmail.com",
    image: "not_found",
    id: "not_found",
  },
  headerPin: { Pin0: "BTCUSDT", Pin1: "ETHUSDT" },
  FormData: {
    isvisible: false,
    symbol: "btcusd",
    market: "SPOT",
    orderType: "LIMIT",
    oderdetails: {
      orderType: "BUY",
      quantity: 1,
      price: 1010,
      sl: 0,
      tp: 0,
    },
  },
};

export interface IdataContextProps {
  dataState: IdataContextState;
  dataDispatch: React.Dispatch<IdataContextActions>;
}

const DataContext = createContext<IdataContextProps>({
  dataState: defaultdataContextState,
  dataDispatch: () => {
    console.log("due to ts error");
  },
});

export const DataContextConsumer = DataContext.Consumer;
export const DataContextProvider = DataContext.Provider;

export default DataContext;
