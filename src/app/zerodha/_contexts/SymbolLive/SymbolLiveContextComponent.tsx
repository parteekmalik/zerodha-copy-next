import axios from "axios";
import type { PropsWithChildren } from "react";
import React, { useContext, useEffect, useReducer } from "react";
import useLiveWS from "../../_hooks/useLiveWS";
import DataContext from "../data/data";
import type { TsymbolTrade } from "./SymbolLive";
import {
  SymbolLiveContextProvider,
  defaultsymbolLiveContextState,
} from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";
import { Twsbinance } from "../../_components/WatchList/drag_drop_wishlist/symbolInWL";
import { api } from "~/trpc/react";
import { TOrderCalculations } from "../../_components/Rightside/Positions/functions/OrderCalculations";
import TsMap from "ts-map";

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
  const symbolList = api.symbolList.getSymbolList.useQuery().data;
  useEffect(() => {
    if (symbolList && symbolLiveState.symbolsList[0] === undefined) {
      symbolLiveDispatch({ type: "update_symbolList", payload: symbolList });
    }
  }, [symbolList]);
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
    }
    symbolLiveDispatch({
      type: "update_symbol",
      payload: { curPrice: data.p, symbol: data.s },
    });
  }

  const { dataState } = useContext(DataContext);

  function socketSend(payload: Twsbinance) {
    payload.params = payload.params.map((item) => {
      const [first, second] = item.split("@");
      return first?.toLowerCase() + "@" + second;
    });

    if (payload.method === "UNSUBSCRIBE") {
      payload.params = payload.params.filter(
        (item) =>
          item === dataState.headerPin.Pin0 + "@trade" &&
          item === dataState.headerPin.Pin1 + "@trade",
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
  const closed_open_OrdersData = (list: TsMap<string, TOrderCalculations>) => {
    return list.keys().map((key, i) => {
      const value = list.get(key);
      let data: {
        Product: string;
        Instrument: string;
        Quantity: number;
        AVG: number;
        LTP: number;
        "P&L": string;
        change: string;
      } = {
        Product: "SPOT",
        Instrument: key,
        Quantity: 0,
        AVG: 0,
        LTP: 0,
        "P&L": "0",
        change: "0",
      };
      if (value) {
        const QUANTITY = value.BuyQuantity - value.SellQuantity;
        const AVG =
          QUANTITY === 0 ? 0 : value.BuyPriceTotal / value.BuyQuantity;
        const CURPRICE = symbolLiveState.Livestream[key]?.curPrice ?? 0;
        const PROFIT =
          (QUANTITY !== 0 ? QUANTITY * CURPRICE : 0) +
          value.SellPriceTotal -
          value.BuyPriceTotal;

        const CHANGE =
          QUANTITY === 0
            ? "0.00%"
            : ((PROFIT * 100) / value.BuyPriceTotal).toFixed(2) + "%";

        data = {
          ...data,
          Quantity: QUANTITY,
          AVG: AVG,
          LTP: CURPRICE,
          "P&L": PROFIT.toFixed(2),
          change: CHANGE,
        };
      }
      return {
        id: "" + i,
        data,
      };
    });
  };
  return (
    <SymbolLiveContextProvider
      value={{
        symbolLiveState,
        symbolLiveDispatch,
        socketSend,
        closed_open_OrdersData,
      }}
    >
      {children}
    </SymbolLiveContextProvider>
  );
};

export default SymbolLiveContextComponent;
// (
//   QUANTITY * (symbolLiveState.Livestream[key]?.curPrice ?? 1) -
//   PROFIT
// ).toFixed(2)
