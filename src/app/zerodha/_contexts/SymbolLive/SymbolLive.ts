import { createContext } from "react";
import { IsymbolLiveContextActions } from "./SymbolLiveReducer";

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
export type IsymbolLiveContextState = {
  [key: string]: TsymbolTrade;
};
export const defaultsymbolLiveContextState = {};
export interface IsymbolLiveContextProps {
  symbolLiveState: IsymbolLiveContextState;
  symbolLiveDispatch: React.Dispatch<IsymbolLiveContextActions>;
}

const SymbolLiveContext = createContext<IsymbolLiveContextProps>({
  symbolLiveState: defaultsymbolLiveContextState,
  symbolLiveDispatch: () => {},
});

export const PageContextConsumer = SymbolLiveContext.Consumer;
export const SymbolLiveContextProvider = SymbolLiveContext.Provider;

export default SymbolLiveContext;
