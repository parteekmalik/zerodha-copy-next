import { createContext } from "react";
import type { Twsbinance } from "../../_components/WatchList/drag_drop_wishlist/symbolInWL";
import { JSONType } from "../../../../../public/symbolname";
import { TtickerChangeType } from "./SymbolLiveContextComponent";
import type { IsymbolLiveContextActions } from "./SymbolLiveReducer";
import { TOrderCalculations } from "../../_components/Rightside/Positions/functions/OrderCalculations";
import TsMap from "ts-map";

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

export type IsymbolLiveContextState = {
  Livestream: Record<string, TsymbolLive>;
  symbolsList: Record<string, JSONType>;
  last24hrdata: Record<string, TtickerChangeType>;
};

export const defaultsymbolLiveContextState = {
  Livestream: {},
  symbolsList: {},
  last24hrdata: {},
};
export interface IsymbolLiveContextProps {
  symbolLiveState: IsymbolLiveContextState;
  symbolLiveDispatch: React.Dispatch<IsymbolLiveContextActions>;
  socketSend: (payload: Twsbinance) => void;
  closed_open_OrdersData: (list: TsMap<string, TOrderCalculations>) => {
    id: string;
    data: (string | number)[];
  }[];
}

const SymbolLiveContext = createContext<IsymbolLiveContextProps>({
  symbolLiveState: defaultsymbolLiveContextState,
  symbolLiveDispatch: () => {
    console.log("due to ts error");
  },
  socketSend: () => {
    console.log("due to ts error");
  },
  closed_open_OrdersData: (list: TsMap<string, TOrderCalculations>) => {
    return [
      {
        id: "sda",
        data: [1, "1"],
      },
    ];
  },
});

export const PageContextConsumer = SymbolLiveContext.Consumer;
export const SymbolLiveContextProvider = SymbolLiveContext.Provider;

export default SymbolLiveContext;
