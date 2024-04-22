import type { PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { env } from "~/env";
import { RootState } from "../../_redux/store";
import { useToast } from "../Toast/toast-context";
import { BackndWSContextProvider } from "./backendWS";
import useSocket from "../../_hooks/useSocket";

const BackendWSContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  const [backendServerConnection, setbackendServerConnection] = useState<
    "connected" | "disconneted"
  >("disconneted");

  const toast = useToast();
  const { socket, isConnected, lastMessage } = useSocket(
    env.NEXT_PUBLIC_BACKEND_WS,
    UserInfo.TradingAccountId,
    {},
  );
  useEffect(() => {
    if (toast && lastMessage) {
      console.log("lastMessage -> ", typeof lastMessage, lastMessage);
      if (typeof lastMessage === "object") {
        toast.open({
          name: lastMessage.name,
          state:
            lastMessage.status === "open"
              ? "placed"
              : lastMessage.status === "completed"
                ? "sucess"
                : "error",
          quantity: lastMessage.quantity,
          orderId: lastMessage.id,
          type: lastMessage.type,
        });
      } else if (typeof lastMessage === "string") {
        setbackendServerConnection(lastMessage);
      }
    }
  }, [lastMessage]);

  function WSsendOrder(messageType: string, payload: unknown) {
    console.log("message sent ws ->", messageType, payload);
    socket?.emit(messageType, JSON.stringify(payload));
  }

  return (
    <BackndWSContextProvider value={{ WSsendOrder, backendServerConnection }}>
      {children}
    </BackndWSContextProvider>
  );
};

export default BackendWSContextComponent;
