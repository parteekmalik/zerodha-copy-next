import type { PropsWithChildren } from "react";
import React, { useContext, useEffect } from "react";
import { env } from "~/env";
import useSocket from "../../_hooks/useSocket";
import { useToast } from "../Toast/toast-context";
import DataContext from "../data/data";
import { BackndWSContextProvider } from "./backendWS";

const BackendWSContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;
  const { dataState, loading } = useContext(DataContext);

  const toast = useToast();
  const { socket, isConnected, lastMessage } = useSocket(
    env.NEXT_PUBLIC_BACKEND_WS,
    dataState.userDetails.TradingAccountId,
    {},
  );
  useEffect(() => {
    if (toast && lastMessage && lastMessage) {
      console.log("lastMessage -> ", typeof lastMessage, lastMessage);
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
    }
  }, [lastMessage]);
  function WSsendOrder(messageType: string, payload: unknown) {
    console.log("message sent ws ->", messageType, payload);
    socket?.emit(messageType, JSON.stringify(payload));
  }

  return (
    <BackndWSContextProvider value={{ WSsendOrder }}>
      {children}
    </BackndWSContextProvider>
  );
};

export default BackendWSContextComponent;
