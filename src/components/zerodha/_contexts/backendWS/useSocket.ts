import { type Order } from "@prisma/client";
import { useEffect, useState } from "react";
import io, { type ManagerOptions, type Socket, type SocketOptions } from "socket.io-client";
import {
  type UPDATE_OR_ADD_ORDER,
  type UPDATE_OR_ADD_ORDER_PAYLOAD,
} from "../../../../../WStypes/typeForSocketToFrontend";
import {
  AUTHENTICATION,
  type AUTHENTICATION_PAYLOAD,
  BACKEND_SERVER_UPDATE,
  type BACKEND_SERVER_UPDATE_PAYLOAD,
  NOTIFICATION,
  type NOTIFICATION_PAYLOAD,
} from "../../../../../WStypes/typeForFrontendToSocket";

export type socketSendType = {
  type: typeof UPDATE_OR_ADD_ORDER;
  payload: UPDATE_OR_ADD_ORDER_PAYLOAD;
};
const useSocket = (serverUrl: string, opts?: Partial<ManagerOptions & SocketOptions> | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastmessage] = useState<Order | BACKEND_SERVER_UPDATE_PAYLOAD | null>(null);
  const [backendServerConnection, setbackendServerConnection] = useState<BACKEND_SERVER_UPDATE_PAYLOAD>("disconneted");
  useEffect(() => {
    if (!opts?.auth || !("token" in opts.auth) || !opts.auth.token) return;
    // Continue with your logic if the token exists
    console.log("connecting to server", serverUrl, opts.auth.token);

    const socketInstance = io(serverUrl, opts);

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    socketInstance.on(AUTHENTICATION, (msg: AUTHENTICATION_PAYLOAD) => console.log(AUTHENTICATION, msg));
    socketInstance.on(BACKEND_SERVER_UPDATE, (msg: BACKEND_SERVER_UPDATE_PAYLOAD) => setbackendServerConnection(msg));
    socketInstance.on(NOTIFICATION, (msg: NOTIFICATION_PAYLOAD) => {
      setLastmessage(msg);
    });
    setSocket(socketInstance);

    // Clean-up function to disconnect the socket when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl, opts]);

  function SocketEmiter({ type, payload }: socketSendType) {
    console.info("Emitted - Action: " + type + " - Payload: ", payload);
    socket?.emit(type, payload);
  }
  return { SocketEmiter, backendServerConnection, isConnected, lastMessage };
};

export default useSocket;
