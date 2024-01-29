import type { PropsWithChildren } from "react";
import React, { useReducer } from "react";
import { useSocket } from "../../_hooks/useWS";
import type { TsymbolTrade } from "./SymbolLive";
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
    const data: string = event.data; // Assuming event.data is a string
    console.log(data);
    try {
      const parsedData: TsymbolTrade = JSON.parse(data);
      if (!parsedData.e) return;
      symbolLiveDispatch({ type: "update_symbol", payload: parsedData });
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  }

  const [symbolLiveState, symbolLiveDispatch] = useReducer(
    symbolLiveReducer,
    defaultsymbolLiveContextState,
  );

  return (
    <>
      <SymbolLiveContextProvider
        value={{ symbolLiveState, symbolLiveDispatch, socketSend }}
      >
        {children}
      </SymbolLiveContextProvider>
    </>
  );
};

export default SymbolLiveContextComponent;
