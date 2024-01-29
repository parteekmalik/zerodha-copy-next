import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Options } from "react-use-websocket";

export const useSocket = (
  url: string,
  opt: Options,
): [(payload: string) => void, MessageEvent<string> | null] => {
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

  const socketSend = (payload: string) => {
    if (connectionStatus === "Open") {
      console.log(payload);

      sendMessage(payload);
    } else {
      setMessageQ((prevMessageQ) => [...prevMessageQ, payload]);
    }
  };

  return [socketSend, lastMessage];
};
