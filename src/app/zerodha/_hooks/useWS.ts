import { useEffect, useState } from "react";
import type { Options } from "react-use-websocket";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Twsbinance } from "../_components/WatchList/symbolInWL";
import { TsymbolTrade } from "../_contexts/SymbolLive/SymbolLive";

export const useSocket = (
  url: string,
  processMessages: (data: TsymbolTrade) => void,
  opt: Options,
): [(payload: Twsbinance) => void, string[], MessageEvent<string> | null] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    ...opt,
    onClose: () => console.log("WebSocket connection closed."),
    onOpen: () => {
      console.log("WebSocket connection opened.");
      if (messageQ.length > 0)
        console.log(
          "mesageq send ->",
          JSON.stringify({
            method: "SUBSCRIBE",
            params: messageQ,
            id: 1,
          } as Twsbinance),
        );
      setsubscriptions(messageQ);
      sendMessage(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: messageQ,
          id: 1,
        } as Twsbinance),
      );
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data as string) as
        | TsymbolTrade
        | { result: string[]; id: number };
      if ("id" in data) {
        console.log("websocket message or responce ->", data);
        if (data.id === 3) {
          setsubscriptions(data.result);
        } else {
          updatSubscription();
        }
      } else {
        // console.log("is workibng!!!!!!!!!!!!!", data);
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
  function deleteDuplicateReq(payload: Twsbinance) {
    if (payload.method === "UNSUBSCRIBE") {
      payload.params = payload.params.filter((item) => {
        if (subscriptions.includes(item)) return true;
      });
    } else if (payload.method === "SUBSCRIBE") {
      // console.log(payload);
      payload.params = payload.params.filter((item) => {
        if (!subscriptions.includes(item)) return true;
      });
      // console.log(payload);
    }
    if (payload.params.length) return payload;
  }
  const socketSend = (payload: Twsbinance) => {
    const Payload = deleteDuplicateReq(payload);
    if (!Payload || Payload.params.length === 0) return;

    // console.log("send socket ->", Payload);
    if (connectionStatus === "Open") {
      console.log("mesageq send ->", JSON.stringify(Payload));
      setsubscriptions(payload.params);
      sendMessage(JSON.stringify(Payload));
    } else {
      setmessageQ((prev) => {
        // console.log(
        //   "check ->",
        //   Payload.params.filter((item) => {
        //     if (!messageQ.includes(item)) return true;
        //   }),
        //   prev,
        // );
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
