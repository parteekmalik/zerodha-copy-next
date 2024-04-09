import axios from "axios";
import type { PropsWithChildren } from "react";
import React, { createContext, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import TsMap from "ts-map";
import { TOrderCalculations } from "../../_components/Rightside/Positions/functions/OrderCalculations";
import { Twsbinance } from "../../_components/WatchList/drag_drop_wishlist/symbolInWL";
import useLiveWS from "../../_hooks/useLiveWS";
import { updateLivestream } from "../../_redux/Livestream/Livestream";
import { AppDispatch, RootState } from "../../_redux/store";
import { defaultsymbolLiveContextState } from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";
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
// export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}
export type TtickerChangeType = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

const SymbolLiveContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;
  const Livestream = useSelector((state: RootState) => state.Livestream);
  const dispatch = useDispatch<AppDispatch>();

  const [symbolLiveState, symbolLiveDispatch] = useReducer(
    symbolLiveReducer,
    defaultsymbolLiveContextState,
  );

  const [Ssend, subscriptions] = useLiveWS(
    "wss://stream.binance.com:9443/ws",
    {},
    processMessages,
  );

  function processMessages(data: TsymbolTrade) {
    if (data.e !== "trade") {
      // console.log(data);
    } else dispatch(updateLivestream({ curPrice: data.p, symbol: data.s }));
  }

  const headerPin = useSelector((state: RootState) => state.headerPin);

  function socketSend(payload: Twsbinance) {
    payload.params = payload.params.map((item) => {
      const [first, second] = item.split("@");
      return first?.toLowerCase() + "@" + second;
    });

    if (payload.method === "UNSUBSCRIBE") {
      payload.params = payload.params.filter(
        (item) =>
          item === headerPin.Pin0 + "@trade" &&
          item === headerPin.Pin1 + "@trade",
      );
      // console.log("remove pins from unsubscribe ->", payload);
    }
    if (payload.params.length) Ssend(payload);
  }

  useEffect(() => {
    const url = "https://api.binance.com/api/v3/ticker/24hr?symbols=";
    const subSymbol = JSON.stringify(
      subscriptions.map((item) => item.split("@")[0]?.toUpperCase()),
    );

    if (subSymbol !== "[]")
      axios
        .get(url + subSymbol)
        .then((data: { data: TtickerChangeType[] }) => {
          console.log("TtickerChangeType -> ", data.data);
          const payload = data.data.map((item) => {
            return {
              symbol: item.symbol,
              prevPrice: item.openPrice,
              curPrice: item.lastPrice,
            };
          });
          symbolLiveDispatch({
            type: "update_last24hrdata",
            payload,
          });
          return data.data;
        })
        .catch((error) => console.log(error));
  }, [subscriptions]);
  return (
    <SymbolLiveContext.Provider
      value={{
        socketSend,
      }}
    >
      {children}
    </SymbolLiveContext.Provider>
  );
};

export default SymbolLiveContextComponent;

export interface IsymbolLiveContextProps {
  socketSend: (payload: Twsbinance) => void;
}
[];
// TODO :fix and auto asses types solution
const SymbolLiveContext = createContext<typeof value>({});
