// toat-context.ts
import { createContext, useContext } from "react";
import { type messageType } from "./toast";

type ToastContextValue = {
  open: (message: messageType) => void;
  close: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context ) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};