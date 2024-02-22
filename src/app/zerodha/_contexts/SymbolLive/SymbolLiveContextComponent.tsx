import axios from "axios";
import type { PropsWithChildren } from "react";
import React, { useContext, useEffect, useReducer } from "react";
import type { Twsbinance } from "../../_components/WatchList/symbolInWL";
import { useSocket } from "../../_hooks/useWS";
import DataContext from "../data/data";
import type { Tlast24hr } from "./SymbolLive";
import {
  SymbolLiveContextProvider,
  defaultsymbolLiveContextState,
} from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";

// export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}

const SymbolLiveContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;

  const [Ssend] = useSocket("wss://stream.binance.com:9443/ws", {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    onMessage: (event) => processMessages(event),
  });

  function processMessages(event: MessageEvent) {
    const data = JSON.parse(event.data as string) as Tlast24hr;
    if (!data.e) {
      console.log("websocket message or responce ->", data);
      return;
    }
    if (data.e !== "trade") {
      // console.log(data);
      symbolLiveDispatch({ type: "update_symbol", payload: data });
    }
  }
  const { dataState } = useContext(DataContext);

  function socketSend(payload: Twsbinance) {
    if (payload.method === "UNSUBSCRIBE") {
      payload.params = payload.params.filter(
        (item) =>
          item !== dataState.headerPin[0] + "@ticker" &&
          item !== dataState.headerPin[1] + "@ticker",
      );
    }
    Ssend(payload);
  }

  const [symbolLiveState, symbolLiveDispatch] = useReducer(
    symbolLiveReducer,
    defaultsymbolLiveContextState,
  );

  useEffect(() => {
    async function updateList() {
      return await axios
        .get("https://api.binance.com/api/v3/exchangeInfo")
        .then((data) => {
          const symbols = (
            data.data as { symbols: TsymbolTypes[] }
          ).symbols.filter((s) => {
            if (s.quoteAsset === "USDT" && s.status === "TRADING") return s;
          });
          return symbols;
        });
    }
    updateList()
      .then((data) => {
        symbolLiveDispatch({ type: "update_symbolList", payload: data });
      })
      .catch(() => console.log("failed to retieve symbolList"));
  }, []);

  return (
    <SymbolLiveContextProvider
      value={{ symbolLiveState, symbolLiveDispatch, socketSend }}
    >
      {children}
    </SymbolLiveContextProvider>
  );
};
export type TsymbolTypes = {
  allowTrailingStop: boolean;
  allowedSelfTradePreventionModes:
    | "EXPIRE_TAKER"
    | "EXPIRE_MAKER"
    | "EXPIRE_BOTH";
  baseAsset: string;
  baseAssetPrecision: number;
  baseCommissionPrecision: number;
  cancelReplaceAllowed: boolean;
  defaultSelfTradePreventionMode: string;
  filters: [];
  icebergAllowed: boolean;
  isMarginTradingAllowed: boolean;
  isSpotTradingAllowed: boolean;
  ocoAllowed: boolean;
  orderTypes:
    | "LIMIT"
    | "LIMIT_MAKER"
    | "MARKET"
    | "STOP_LOSS_LIMIT"
    | "TAKE_PROFIT_LIMIT";
  permissions:
    | "SPOT"
    | "MARGIN"
    | "TRD_GRP_004"
    | "TRD_GRP_005"
    | "TRD_GRP_006"
    | "TRD_GRP_009"
    | "TRD_GRP_010"
    | "TRD_GRP_011"
    | "TRD_GRP_012"
    | "TRD_GRP_013"
    | "TRD_GRP_014"
    | "TRD_GRP_015"
    | "TRD_GRP_016"
    | "TRD_GRP_017"
    | "TRD_GRP_018"
    | "TRD_GRP_019"
    | "TRD_GRP_020"
    | "TRD_GRP_021"
    | "TRD_GRP_022"
    | "TRD_GRP_023"
    | "TRD_GRP_024"
    | "TRD_GRP_025";
  quoteAsset: string;
  quoteAssetPrecision: number;
  quoteCommissionPrecision: number;
  quoteOrderQtyMarketAllowed: boolean;
  quotePrecision: number;
  status: "TRADING";
  symbol: string;
};
export default SymbolLiveContextComponent;
