import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toast-context";
import { useScroll } from "framer-motion";
import moment from "moment";
import { error } from "console";
import { $Enums } from "@prisma/client";

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
type stateType = "error" | "sucess" | "placed" | "cancelled";
export type messageType = {
  name: string;
  state: stateType;
  quantity: number | string;
  orderId: string;
  type: $Enums.OrderType;
  errorMessage?: string;
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
  id: string;
};
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, settoasts] = useState<ToastType[]>([]);

  function openToast(message: messageType) {
    const newToast = {
      id: moment().toDate().toString(),
      message,
    };
    settoasts((prev) => [...prev, newToast]);
  }
  function closeToast(id: string) {
    settoasts((prev) => prev.filter((toast) => toast.message.orderId !== id));
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
                  key={toast.id}
                  message={toast.message}
                  close={() => closeToast(toast.message.orderId)}
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
  stateType,
  {
    color: string;
    heading: string;
  }
> = {
  error: {
    color: " border-[#ff5722] text-[#ff5722] ",
    heading: "Error",
  },
  cancelled: {
    color: " border-[#555555] text-[#555555] ",
    heading: "Canceled",
  },
  sucess: {
    color: " border-[#42a142] text-[#42a142] ",
    heading: "Sucesss",
  },
  placed: {
    color: " border-[#4184f3] text-[#4184f3] ",
    heading: "Placed",
  },
};
function Toast({ message, close }: ToastProperties) {
  useTimeout(() => close(), 10000);
  return (
    <div
      className={
        "boarder-[0.677px] reative relative m-[0px_10px_10px_0px]  max-w-[400px] animate-slidein   rounded border-l-[20px] bg-white p-[10px_20px_15px_15px]" +
        ToastStaticData[message.state].color
      }
      style={{ wordWrap: "break-word" }}
    >
      <h4 className="m-[5px_0px_10px_0px] text-[16px] font-bold">
        {ToastStaticData[message.state].heading}
      </h4>
      {message.state === "sucess" && (
        <div className="text-[14px]">
          {message.type} {message.name} is Sucessful.
          <br />
          <span className="m-t-[10px] text-[.75rem]">#{message.orderId}</span>
        </div>
      )}
      {message.state === "cancelled" && (
        <div className="text-[14px]">
          Order
          <span className="m-t-[10px] text-[.75rem]">#{message.orderId}</span>
          is Cancelled.
          <br />
          <span className="m-t-[10px] text-[.75rem]">#{message.orderId}</span>
        </div>
      )}
      {message.state === "error" && (
        <div className="text-[14px]">{message.errorMessage}</div>
      )}
      {message.state === "placed" && (
        <div className="text-[14px]">
          {message.type} {message.name} is Placed.
          <br />
          Check the orderbook for status.
          <br />
          <span className="m-t-[10px] text-[.75rem]">#{message.orderId}</span>
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
