import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { useToast } from "../Toast/toast-context";
import useSocket, { socketSendType } from "./useSocket";

interface IWSContext {
  WSsendOrder: ({ type, payload }: socketSendType) => void;
  backendServerConnection: "connected" | "disconneted";
}

const BackndWSContext = createContext<IWSContext | undefined>(undefined);

export const BackendWSProvider: React.FC<{ children: ReactNode }> = (props) => {
  const { children } = props;

  const toast = useToast();
  const { data: session, status } = useSession();

  const opts = useMemo(
    () => ({
      // reconnection: false,
      reconnectionDelay: 10000,
      auth: {
        token: session?.user.token,
      },
    }),
    [session?.user.token],
  );
  const { SocketEmiter, backendServerConnection, isConnected, lastMessage } =
    useSocket(env.NEXT_PUBLIC_BACKEND_WS, opts);
  const APIutils = api.useUtils();

  useEffect(
    () => console.log("backendServerConnection", backendServerConnection),
    [backendServerConnection],
  );
  useEffect(() => {
    if (toast && lastMessage) {
      console.log("lastMessage -> ", typeof lastMessage, lastMessage);
      if (typeof lastMessage === "object") {
        toast.open({
          name: lastMessage.name,
          state: lastMessage.status === "OPEN" ? "placed" : "sucess",
          quantity: lastMessage.quantity,
          orderId: lastMessage.id,
          type: lastMessage.type,
        });
        APIutils.Order.getOrders.refetch().catch((err) => console.log(err));
        APIutils.Console.getRemainingFilledOrders
          .refetch()
          .catch((err) => console.log(err));
      }
    }
  }, [lastMessage]);

  return (
    <BackndWSContext.Provider
      value={{ WSsendOrder: SocketEmiter, backendServerConnection }}
    >
      {children}
    </BackndWSContext.Provider>
  );
};

// Custom hook to use DrawerContext
export const useBackendWS = () => {
  const context = useContext(BackndWSContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
