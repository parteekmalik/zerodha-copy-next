import { createContext } from "react";
import type { Twsbinance } from "../../_components/WatchList/symbolInWL";
import { JSONType } from "../../symbolname";
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
export type Tlast24hr = {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  w: string;
  x: string;
  c: string;
  Q: string;
  b: string;
  B: string;
  a: string;
  A: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  O: number;
  C: number;
  F: number;
  L: number;
  m: boolean;
  n: number;
};
export type IsymbolLiveContextState = {Livestream:Record<string, Tlast24hr>,symbolsList:Record<string, JSONType>};

export const defaultsymbolLiveContextState = {Livestream:{},symbolsList:{} };
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
