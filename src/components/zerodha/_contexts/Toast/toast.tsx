// toast.tsx
import { $Enums } from "@prisma/client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toast-context";

function useTimeout(callbackFunction: () => void, duration: number) {
  const SavedCallback = useRef(callbackFunction);

  useEffect(() => {
    SavedCallback.current = callbackFunction;
  }, [callbackFunction]);
  useEffect(() => {
    const functionId = setTimeout(() => SavedCallback.current(), duration);
    return () => clearTimeout(functionId);
  }, []);
}
type stateType = "sucess" | "placed" | "cancelled" | "update";
export type messageType =
  | { state: "error"; errorMessage?: string }
  | {
      name: string;
      state: stateType;
      quantity: number | string;
      orderId: string | number;
      type: $Enums.OrderType;
    };
interface ToastProperties {
  message: messageType;
  close: () => void;
}

type ToastProviderProps = {
  children: React.ReactElement;
};
type ToastType = {
  message: messageType;
  id: string | number;
};
export function ToastProvider({ children }: ToastProviderProps) {
  const ToastCount = useRef(0);
  const [toasts, settoasts] = useState<ToastType[]>([]);

  function openToast(message: messageType) {
    const newToast = {
      id: ToastCount.current,
      message,
    };
    ToastCount.current++;
    settoasts((prev) => [...prev, newToast]);
  }
  function closeToast(id: string | number) {
    settoasts((prev) => prev.filter((toast) => toast.id !== id));
  }
  const contextValue = useMemo(
    () => ({
      open: openToast,
      close: closeToast,
    }),
    [],
  );
  return (
    <>
      <ToastContext.Provider value={contextValue}>
        {children}
        {toasts && (
          <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 ">
            {toasts.map((toast) => {
              return (
                <Toast
                  key={"toast" + toast.id}
                  message={toast.message}
                  close={() => closeToast(toast.id)}
                ></Toast>
              );
            })}
          </div>
        )}
      </ToastContext.Provider>
    </>
  );
}
const ToastStaticData: Record<
  stateType | "error",
  {
    color: string;
    heading: string;
  }
> = {
  error: {
    color: " border-orangeApp text-orangeApp ",
    heading: "Error",
  },
  cancelled: {
    color: " border-borderApp text-borderApp",
    heading: "Canceled",
  },
  sucess: {
    color: " border-greenApp text-greenApp  ",
    heading: "Sucesss",
  },
  placed: {
    color: " border-blueApp text-blueApp ",
    heading: "Placed",
  },
  update: {
    color: " border-blueApp text-blueApp ",
    heading: "Placed",
  },
};
function Toast({ message, close }: ToastProperties) {
  useTimeout(close, 10000);
  return (
    <div
      className={
        "boarder-[0.677px]   reative animate-slidein relative  m-[0px_10px_10px_0px] max-w-[400px]   rounded border-l-[20px] bg-white p-[10px_20px_15px_15px]" +
        ToastStaticData[message.state].color
      }
      style={{ wordWrap: "break-word" }}
    >
      <h4 className="m-[5px_0px_10px_0px] text-[16px] font-bold">
        {ToastStaticData[message.state].heading}
      </h4>
      {message.state === "sucess" && (
        <div className="text-sm">
          {message.type} {message.name} is Sucessful.
          <br />
          <span className="m-t-[10px] text-xs">#{message.orderId}</span>
        </div>
      )}
      {message.state === "cancelled" && (
        <div className="text-sm">
          Order
          <span className="m-t-[10px] text-xs">#{message.orderId}</span>
          is Cancelled.
          <br />
          <span className="m-t-[10px] text-xs">#{message.orderId}</span>
        </div>
      )}
      {message.state === "error" && (
        <div className="text-sm">{message.errorMessage}</div>
      )}
      {message.state === "placed" && (
        <div className="text-sm">
          {message.type} {message.name} is Placed.
          <br />
          Check the orderbook for status.
          <br />
          <span className="m-t-[10px] text-xs">#{message.orderId}</span>
        </div>
      )}
      {message.state === "update" && (
        <div className="text-sm">
          {message.type} {message.name} is Updated.
          <br />
          Check the orderbook for status.
          <br />
          <span className="m-t-[10px] text-xs">#{message.orderId}</span>
        </div>
      )}
      <div
        className="absolute right-[10px] top-[15px] hover:cursor-pointer"
        onClick={() => close()}
      >
        x
      </div>
    </div>
  );
}
export default Toast;
