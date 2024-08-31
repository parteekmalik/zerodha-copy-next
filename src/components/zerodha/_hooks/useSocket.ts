import { Order } from "@prisma/client";
import { SocketOptions } from "dgram";
import { useEffect, useState } from "react";
import io, { ManagerOptions, Socket } from "socket.io-client";

interface SocketHook {
  socket: Socket | null;
  isConnected: boolean;
}
export type orderType = Order;
const useSocket = (
  serverUrl: string,
  TradingAccountId: string,
  opts?: Partial<ManagerOptions & SocketOptions> | undefined,
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastmessage] = useState<
    orderType | "connected" | "disconneted"
  >("disconneted");

  useEffect(() => {
    const socketInstance = io(serverUrl, { ...opts });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    socketInstance.on("Authentication", (msg: unknown) =>
      console.log("Authentication", msg),
    );
    socketInstance.on(
      "backendServerUpdate",
      (msg: "connected" | "disconneted") => setLastmessage(msg),
    );
    socketInstance.on("notification", (msg: orderType) => {
      setLastmessage(msg);
    });
    socketInstance.once("connect", () => {
      SocketEmiter(
        "authenticate",
        JSON.stringify({
          TradingAccountId,
        }),
      );
    });
    function SocketEmiter(type: string, payload: string) {
      console.info("Emitted - Action: " + type + " - Payload: ", payload);
      socketInstance.emit(type, payload);
    }
    setSocket(socketInstance);

    // Clean-up function to disconnect the socket when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl, TradingAccountId]);

  return { socket, isConnected, lastMessage };
};

export default useSocket;
