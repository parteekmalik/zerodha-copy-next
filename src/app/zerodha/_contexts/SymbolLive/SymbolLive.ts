import { createContext } from "react";
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
export type IsymbolLiveContextState = Record<string, TsymbolTrade>;

export const defaultsymbolLiveContextState = {};
export interface IsymbolLiveContextProps {
  symbolLiveState: IsymbolLiveContextState;
  symbolLiveDispatch: React.Dispatch<IsymbolLiveContextActions>;
  socketSend: (payload: string) => void;
}

const SymbolLiveContext = createContext<IsymbolLiveContextProps>({
  symbolLiveState: defaultsymbolLiveContextState,
  symbolLiveDispatch: () => {},
  socketSend: () => {},
});

export const PageContextConsumer = SymbolLiveContext.Consumer;
export const SymbolLiveContextProvider = SymbolLiveContext.Provider;

export default SymbolLiveContext;
