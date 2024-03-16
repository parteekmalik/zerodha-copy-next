import { useEffect, useState } from "react";
import type { Options } from "react-use-websocket";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { TsymbolTrade } from "../_contexts/SymbolLive/SymbolLive";
import { Twsbinance } from "../_components/WatchList/symbolInWL";

let subscriptions: string[] = [];

export const useSocket = (
  url: string,
  opt: Options,
  processMessages?: (data: TsymbolTrade) => void,
): [(payload: Twsbinance) => void, string[], MessageEvent<string> | null] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    ...opt,
    onClose: () => console.log("WebSocket connection closed."),
    onOpen: () => {
      console.log("WebSocket connection opened.");
      if (messageQ.length > 0) {
        const msg = {
          method: "SUBSCRIBE",
          params: messageQ,
          id: 1,
        } as Twsbinance;

        console.log("mesageq send ->", JSON.stringify(msg));
        subscriptions = messageQ;
        sendMessage(JSON.stringify(msg));
      }
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data as string) as
        | TsymbolTrade
        | { result: string[]; id: number };
      if ("id" in data) {
        if (data.id === 3) {
          subscriptions = data.result;
        } else {
          updatSubscription();
        }
      } else if (processMessages) {
        processMessages(data);
      }
    },
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const [messageQ, setmessageQ] = useState<string[]>([]);

  const updatSubscription = () => {
    sendMessage(JSON.stringify({ method: "LIST_SUBSCRIPTIONS", id: 3 }));
  };
  function deleteDuplicateReq(payload: Twsbinance) {
    if (payload.method === "UNSUBSCRIBE") {
      payload.params = payload.params.filter((item) => {
        if (subscriptions.includes(item)) return true;
      });
    } else if (payload.method === "SUBSCRIBE") {
      payload.params = payload.params.filter((item) => {
        if (!subscriptions.includes(item)) return true;
      });
    }
    if (payload.params.length) return payload;
  }
  const socketSend = (payload: Twsbinance) => {
    const Payload = deleteDuplicateReq(payload);
    if (!Payload || Payload.params.length === 0) return;

    if (connectionStatus === "Open") {
      console.log("mesage send ->", JSON.stringify(Payload), subscriptions);
      subscriptions = [...subscriptions, ...payload.params];
      sendMessage(JSON.stringify(Payload));
    } else {
      setmessageQ((prev) => {
        return [
          ...prev,
          ...Payload.params.filter((item) => {
            if (!prev.includes(item)) return true;
          }),
        ];
      });
    }
  };

  return [socketSend, subscriptions, lastMessage];
};
