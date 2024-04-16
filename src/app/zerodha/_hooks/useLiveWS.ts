import { useState } from "react";
import type { Options } from "react-use-websocket";
import { Twsbinance } from "../_components/WatchList/drag_drop_wishlist/symbolInWL";
import useWS from "./useWS";
import { TsymbolTrade } from "../_redux/storeComponent";

let subscriptions: string[] = [];

const useLiveWS = (
  url: string,
  opt: Options,
  processMessages?: (data: TsymbolTrade) => void,
): [
  (payload: Twsbinance) => void,
  string[],
  MessageEvent<string> | null,
  string,
] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const [sendMessage, connectionStatus, lastMessage] = useWS(url, {
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

        // console.log("mesageq send ->", JSON.stringify(msg));
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
      // console.log("mesage send ->", JSON.stringify(Payload), subscriptions);
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

  return [socketSend, subscriptions, lastMessage, connectionStatus];
};
export default useLiveWS;
