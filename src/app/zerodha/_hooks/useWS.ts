import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Options } from "react-use-websocket";
import type { Twsbinance } from "../_components/WatchList/symbolInWL";

export const useSocket = (
  url: string,
  opt: Options,
): [(payload: Twsbinance) => void, MessageEvent<string> | null] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    ...opt,
    onOpen: () => {
      console.log("WebSocket connection opened.");
      while (messageQ.length > 0) {
        if (messageQ.length == 0) return;
        const msg = messageQ.shift();
        console.log(msg);
        sendMessage(msg ? msg : "");
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

  const [messageQ, setMessageQ] = useState<string[]>([]);

  const socketSend = (payload: Twsbinance) => {
    if (payload.params.length === 0) return;
    const Spayload = JSON.stringify(payload);
    if (messageQ.includes(Spayload)) return;

    if (connectionStatus === "Open") {
      console.log(Spayload);

      sendMessage(Spayload);
    } else {
      setMessageQ((prevMessageQ) => [...prevMessageQ, Spayload]);
    }
  };

  return [socketSend, lastMessage];
};
