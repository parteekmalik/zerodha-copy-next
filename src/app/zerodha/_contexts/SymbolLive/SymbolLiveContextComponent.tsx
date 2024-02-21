import type { PropsWithChildren } from "react";
import React, { useContext, useReducer } from "react";
import { useSocket } from "../../_hooks/useWS";
import type { Tlast24hr } from "./SymbolLive";
import {
  SymbolLiveContextProvider,
  defaultsymbolLiveContextState,
} from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";
import { Twsbinance } from "../../_components/WatchList/symbolInWL";
import DataContext from "../data/data";

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
  const { dataDispatch, dataState } = useContext(DataContext);

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

  return (
    <SymbolLiveContextProvider
      value={{ symbolLiveState, symbolLiveDispatch, socketSend }}
    >
      {children}
    </SymbolLiveContextProvider>
  );
};

export default SymbolLiveContextComponent;
