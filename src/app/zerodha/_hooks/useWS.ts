import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export const useSocket = (
  url: string,
  opt: any,
): [(payload: any) => void, MessageEvent<any> | null] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    ...opt,
    onOpen: () => {
      console.log("WebSocket connection opened.");
      while (messageQ.length > 0) {
        const msg = messageQ.shift() as string;
        console.log(msg);
        sendMessage(msg);
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

  const socketSend = (payload: any) => {
    if (connectionStatus === "Open") {
      console.log(payload);

      sendMessage(JSON.stringify(payload));
    } else {
      setMessageQ((prevMessageQ) => [...prevMessageQ, JSON.stringify(payload)]);
    }
  };

  return [socketSend, lastMessage];
};
