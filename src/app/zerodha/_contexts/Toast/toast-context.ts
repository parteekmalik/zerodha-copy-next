import { createContext, useContext } from "react";
import { messageType } from "./toast";

type ToastContextValue = {
  open: (message: messageType) => void;
  close: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => useContext(ToastContext)