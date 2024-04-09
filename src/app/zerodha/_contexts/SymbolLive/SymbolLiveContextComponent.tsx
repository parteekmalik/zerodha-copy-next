import axios from "axios";
import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Twsbinance } from "../../_components/WatchList/drag_drop_wishlist/symbolInWL";
import useLiveWS from "../../_hooks/useLiveWS";
import {
  updateLivestream,
  update_last24hrdata,
} from "../../_redux/Livestream/Livestream";
import { AppDispatch, RootState } from "../../_redux/store";
import { SymbolLiveContextProvider } from "./SymbolLive";
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
  
  const headerPin = useSelector((state: RootState) => state.headerPin);
  const dispatch = useDispatch<AppDispatch>();

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
          const last24hrData = data.data.map((item) => {
            return {
              symbol: item.symbol,
              prevPrice: item.openPrice,
              curPrice: item.lastPrice,
            };
          });
          dispatch(update_last24hrdata(last24hrData));
          return data.data;
        })
        .catch((error) => console.log(error));
  }, [subscriptions]);
  return (
    <SymbolLiveContextProvider
      value={{
        socketSend,
      }}
    >
      {children}
    </SymbolLiveContextProvider>
  );
};

export default SymbolLiveContextComponent;
