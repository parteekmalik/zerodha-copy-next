import { createContext } from "react";
interface IWSContext {
  WSsendOrder: (messageType: string, payload: unknown) => void;
}

const BackndWSContext = createContext<IWSContext>({
  WSsendOrder: (messageType: string, payload: unknown) =>
    console.log("dummy function"),
});

export const BackndWSContextConsumer = BackndWSContext.Consumer;
export const BackndWSContextProvider = BackndWSContext.Provider;

export default BackndWSContext;
