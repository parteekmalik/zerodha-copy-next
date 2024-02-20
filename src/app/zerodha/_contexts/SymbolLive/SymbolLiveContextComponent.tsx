import type { PropsWithChildren } from "react";
import React, { useReducer } from "react";
import { useSocket } from "../../_hooks/useWS";
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

  const [socketSend] = useSocket("wss://stream.binance.com:9443/ws", {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    onMessage: (event) => processMessages(event),
  });

  function processMessages(event: MessageEvent) {
    const data = JSON.parse(event.data as string) as Tlast24hr;
    if (!data.e) {
      return;
    }
    if (data.e !== "trade") {
      // console.log(data);
      symbolLiveDispatch({ type: "update_symbol", payload: data });
    }
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
