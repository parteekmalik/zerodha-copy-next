"use client";
import { ToastProvider } from "../../components/zerodha/_contexts/Toast/toast";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { BackendWSProvider } from "~/components/zerodha/_contexts/backendWS/backendWSContextComponent";
import { DrawerProvider } from "~/components/zerodha/_contexts/Drawer/DrawerContextComponent";
import BinanceWSContextComponent from "~/components/zerodha/_contexts/LiveData/BinanceWSContextComponent";
import { store } from "../../components/zerodha/_redux/store";
import StoreComponent from "../../components/zerodha/_redux/storeComponent";

export default function ContextLayer({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <BinanceWSContextComponent>
          <Provider store={store}>
            <BackendWSProvider>
              <StoreComponent />
              <DrawerProvider>{children}</DrawerProvider>
            </BackendWSProvider>
          </Provider>
        </BinanceWSContextComponent>
      </ToastProvider>
    </SessionProvider>
  );
}
