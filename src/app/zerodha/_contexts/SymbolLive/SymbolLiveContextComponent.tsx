import type { PropsWithChildren } from "react";
import React, { useContext, useEffect, useReducer } from "react";
import type { Twsbinance } from "../../_components/WatchList/symbolInWL";
import { useSocket } from "../../_hooks/useWS";
import { symbolList } from "../../symbolname";
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

  function listToRecord<T>(list: T[], key: keyof T): Record<string, T> {
    return list.reduce(
      (record, item) => {
        const keyValue = item[key];
        if (keyValue !== undefined) {
          record[String(keyValue)] = item;
        }
        return record;
      },
      {} as Record<string, T>,
    );
  }

  useEffect(() => {
    console.log(
      "record length ->",
      Object.keys(symbolLiveState.symbolsList).length,
    );
    if (!Object.keys(symbolLiveState.symbolsList).length) {
      symbolLiveDispatch({
        type: "update_symbolList",
        payload: symbolList,
      });
    }
  }, []);

  return (
    <SymbolLiveContextProvider
      value={{ symbolLiveState, symbolLiveDispatch, socketSend }}
    >
      {children}
    </SymbolLiveContextProvider>
  );
};

export default SymbolLiveContextComponent;
