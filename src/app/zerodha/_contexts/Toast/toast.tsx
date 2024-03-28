import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toast-context";
import { useScroll } from "framer-motion";

function useTimeout(callbackFunction: () => void) {
  const SavedCallback = useRef(callbackFunction);

  useEffect(() => {
    SavedCallback.current = callbackFunction;
  }, [callbackFunction]);
  useEffect(() => {
    const functionId = setTimeout(() => SavedCallback.current(), 10000);
    return () => clearTimeout(functionId);
  }, []);
}

interface ToastProperties {
  message: string;
  close: () => void;
}

type ToastProviderProps = {
  children: React.ReactElement;
};
type ToastType = {
  message: string;
  id: number;
};
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, settoasts] = useState<ToastType[]>([]);

  function openToast(message: string) {
    const newToast = {
      id: toasts.length,
      message,
    };
    settoasts((prev) => [...prev, newToast]);
  }
  function closeToast(id: number) {
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
          <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 bg-white ">
            {toasts.map((toast) => {
              return (
                <Toast
                  key={toast.id}
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

function Toast({ message, close }: ToastProperties) {
  useTimeout(() => close());
  return (
    <div
      className="animate-slidein relative mx-2 max-w-[500px] rounded bg-black  text-white"
      style={{ wordWrap: "break-word" }}
    >
      {message}
    </div>
  );
}
export default Toast;
