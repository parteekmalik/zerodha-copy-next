import type { PropsWithChildren } from "react";
import React, { useContext, useEffect, useReducer } from "react";
import type { Twsbinance } from "../../_components/WatchList/symbolInWL";
import { useSocket } from "../../_hooks/useWS";
import { symbolList } from "../../symbolname";
import DataContext from "../data/data";
import type { Tlast24hr, TsymbolTrade } from "./SymbolLive";
import {
  SymbolLiveContextProvider,
  defaultsymbolLiveContextState,
} from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";
import axios from "axios";
import { error } from "console";

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
  const [symbolLiveState, symbolLiveDispatch] = useReducer(
    symbolLiveReducer,
    defaultsymbolLiveContextState,
  );

  const [Ssend, subscriptions] = useSocket(
    "wss://stream.binance.com:9443/ws",
    processMessages,
    {},
  );

  function processMessages(data: TsymbolTrade) {
    if (data.e !== "trade") {
      // console.log(data);
    }
    symbolLiveDispatch({ type: "update_symbol", payload: data });
  }

  const { dataState } = useContext(DataContext);

  function socketSend(payload: Twsbinance) {
    if (payload.method === "UNSUBSCRIBE") {
      payload.params = payload.params.filter(
        (item) =>
          item !== dataState.headerPin[0] + "@trade" &&
          item !== dataState.headerPin[1] + "@trade",
      );
    } else if (payload.method === "SUBSCRIBE") {
      // console.log(payload);
    }
    payload.params = payload.params.map((item) => {
      const [first, second] = item.split("@");
      return first?.toLowerCase() + "@" + second;
    });
    Ssend(payload);
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
          symbolLiveDispatch({
            type: "update_last24hrdata",
            payload: data.data,
          });
          return data.data;
        })
        .catch((error) => console.log(error));
  }, [subscriptions]);
  return (
    <SymbolLiveContextProvider
      value={{ symbolLiveState, symbolLiveDispatch, socketSend }}
    >
      {children}
    </SymbolLiveContextProvider>
  );
};

export default SymbolLiveContextComponent;
