import { createContext } from "react";
import type { Twsbinance } from "../../_components/WatchList/drag_drop_wishlist/symbolInWL";
import { JSONType, symbolList } from "../../symbolname";
import { listToRecord } from "../../utils";
import { TtickerChangeType } from "./SymbolLiveContextComponent";
import type { IsymbolLiveContextActions } from "./SymbolLiveReducer";

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
  symbolsList: listToRecord(symbolList, "symbol"),
  last24hrdata: {},
};
export interface IsymbolLiveContextProps {
  symbolLiveState: IsymbolLiveContextState;
  symbolLiveDispatch: React.Dispatch<IsymbolLiveContextActions>;
  socketSend: (payload: Twsbinance) => void;
}

const SymbolLiveContext = createContext<IsymbolLiveContextProps>({
  symbolLiveState: defaultsymbolLiveContextState,
  symbolLiveDispatch: () => {
    console.log("due to ts error");
  },
  socketSend: () => {
    console.log("due to ts error");
  },
});

export const PageContextConsumer = SymbolLiveContext.Consumer;
export const SymbolLiveContextProvider = SymbolLiveContext.Provider;

export default SymbolLiveContext;
