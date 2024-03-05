import { createContext } from "react";
import type { TorderForm } from "../../_components/OrderForm/orderForm";
import type { Tsymbol } from "../../_components/WatchList/watchList";
import type { IdataContextActions } from "./dataReduer";
import { boolean } from "zod";

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
  FormData: TFormtatur;
}
export type TFormtatur = {
  isvisible: boolean;
  symbol: string;
  type: "BUY" | "SELL";
};
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
  headerPin: { Pin0: "", Pin1: "" },
  FormData: {
    isvisible: false,
    symbol: "BTCUSDT",
    type: "BUY",
  },
};

export interface IdataContextProps {
  dataState: IdataContextState;
  dataDispatch: React.Dispatch<IdataContextActions>;
  loading: boolean;
}

const DataContext = createContext<IdataContextProps>({
  dataState: defaultdataContextState,
  dataDispatch: () => {
    console.log("due to ts error");
  },
  loading: false,
});

export const DataContextConsumer = DataContext.Consumer;
export const DataContextProvider = DataContext.Provider;

export default DataContext;
