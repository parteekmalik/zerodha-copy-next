import { createContext } from "react";
interface IWSContext {
  LiveStreanData: TLivestreamType;
  binanceServerConnection: "connected" | "disconneted";
}
export type TsymbolTrade = { curPrice: string; symbol: string };
export type TsymbolLive = {
  symbol: string;
  curPrice: string;
  isup: boolean;
  decimal: number;
  prevPrice?: number;
  PriceChange?: string;
  PriceChangePercent?: string;
};
export type Tsymbol24hr = {
  symbol: string;
  prevPrice: string;
  curPrice: string;
};
export type TLivestreamType = Record<string, TsymbolLive>;

const BinanceWSContext = createContext<IWSContext>({
  binanceServerConnection: "disconneted",
  LiveStreanData: {},
});

export const BackndWSContextConsumer = BinanceWSContext.Consumer;
export const BackndWSContextProvider = BinanceWSContext.Provider;

export default BinanceWSContext;
