import type { Options } from "react-use-websocket";
import useWebSocket, { ReadyState } from "react-use-websocket";

const useWS = (
  url: string,
  opt: Options,
): [(payload: string) => void, string, MessageEvent<string> | null] => {
  //   const socketRef = useRef<WebSocket>(new WebSocket(url)); // Changed to allow initialization to
  const { sendMessage, lastMessage, readyState } = useWebSocket(url, {
    ...opt,
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const socketSend = (payload: string) => {
    // console.log("mesageq send ->", JSON.stringify(payload));
    sendMessage(payload);
  };

  return [socketSend, connectionStatus, lastMessage];
};
export default useWS;
