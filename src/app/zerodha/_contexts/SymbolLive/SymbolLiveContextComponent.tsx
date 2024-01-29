import React, { PropsWithChildren, useReducer, useState } from "react";
import { useSocket } from "../../_hooks/useWS";
import {
  SymbolLiveContextProvider,
  defaultsymbolLiveContextState,
} from "./SymbolLive";
import { symbolLiveReducer } from "./SymbolLiveReducer";

export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}

const SymbolLiveContextComponent: React.FunctionComponent<
  IsymbolLiveContextComponentProps
> = (props) => {
  const { children } = props;

  const [socketSend, lastMessage] = useSocket(
    "wss://stream.binance.com:9443/ws",
    {
      onOpen: () => console.log("WebSocket connection opened."),
      onClose: () => console.log("WebSocket connection closed."),
      onMessage: (event: WebSocketEventMap["message"]) =>
        processMessages(event),
    },
  );
  const [loading, setLoading] = useState(true);

  function processMessages(event: any) {
    const data = JSON.parse(event.data);
    console.log(data);
    if (!data.e) return;
    symbolLiveDispatch({ type: "update_symbol", payload: data });
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
