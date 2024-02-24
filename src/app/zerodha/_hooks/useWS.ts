import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Options } from "react-use-websocket";
import type { Twsbinance } from "../_components/WatchList/symbolInWL";
import { Tlast24hr } from "../_contexts/SymbolLive/SymbolLive";

export const useSocket = (
  url: string,
  processMessages: (data: Tlast24hr) => void,
  opt: Options,
): [(payload: Twsbinance) => void, string[], MessageEvent<string> | null] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    ...opt,
    onClose: () => console.log("WebSocket connection closed."),
    onOpen: () => {
      console.log("WebSocket connection opened.");
      console.log(messageQ);
      if (messageQ.length > 0)
        sendMessage(
          JSON.stringify({
            method: "SUBSCRIBE",
            params: messageQ,
            id: 1,
          } as Twsbinance),
        );
      updatSubscription();
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data as string) as
        | Tlast24hr
        | { result: string[]; id: number };
      if ("id" in data) {
        console.log("websocket message or responce ->", data);
        if (data.id === 3) {
          setsubscriptions(data.result);
        }
      } else {
        console.log("is workibng!!!!!!!!!!!!!", data);
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
  const [subscriptions, setsubscriptions] = useState<string[]>([]);
  useEffect(() => {
    console.log("subscriptions useeffect ->", subscriptions);
  }, [subscriptions]);
  useEffect(() => {
    console.log("messageQ useeffect ->", messageQ);
  }, [messageQ]);

  const updatSubscription = () => {
    sendMessage(JSON.stringify({ method: "LIST_SUBSCRIPTIONS", id: 3 }));
  };
  const socketSend = (payload: Twsbinance) => {
    if (payload.params.length === 0) return;

    console.log("send socket ->", payload);
    if (connectionStatus === "Open") {
      sendMessage(JSON.stringify(payload));
      updatSubscription();
    } else {
      setmessageQ((prev) => {
        return [...prev, ...payload.params];
      });
    }
  };

  return [socketSend, subscriptions, lastMessage];
};
