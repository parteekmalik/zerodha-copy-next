import { createContext } from "react";
import type { Twsbinance } from "../../_components/WatchList/drag_drop_wishlist/symbolInWL";

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
export type TsymbolLive = {
  symbol: string;
  curPrice: number;
  isup: boolean;
  prevPrice?: number;
  PriceChange?: string;
  PriceChangePercent?: string;
};

export interface IsymbolLiveContextProps {
  socketSend: (payload: Twsbinance) => void;
  // closed_open_OrdersData: (list: TsMap<string, TOrderCalculations>) => {
  //   id: string;
  //   data: {
  //     Product: string;
  //     Instrument: string;
  //     Quantity: number;
  //     AVG: number;
  //     LTP: number;
  //     "P&L": string;
  //     change: string;
  //   };
  // }[];
}
[];
// TODO :fix and auto asses types solution
const SymbolLiveContext = createContext<IsymbolLiveContextProps>({
  socketSend: () => {
    console.log("due to ts error");
  },
  // closed_open_OrdersData: () => {};
});

export const PageContextConsumer = SymbolLiveContext.Consumer;
export const SymbolLiveContextProvider = SymbolLiveContext.Provider;

export default SymbolLiveContext;
