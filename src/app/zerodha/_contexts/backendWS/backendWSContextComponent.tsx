import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { env } from "~/env";
import useSocket from "../../_hooks/useSocket";
import { RootState } from "../../_redux/store";
import { useToast } from "../Toast/toast-context";
import { BackndWSContextProvider } from "./backendWS";

const BackendWSContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;
  const UserInfo = useSelector((state: RootState) => state.UserInfo);

  const toast = useToast();
  const { socket, isConnected, lastMessage } = useSocket(
    env.NEXT_PUBLIC_BACKEND_WS,
    UserInfo.TradingAccountId,
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
