"use client";
import { ToastProvider } from "../../components/zerodha/_contexts/Toast/toast";

import { Provider } from "react-redux";
import { DrawerProvider } from "~/components/zerodha/_contexts/Drawer/DrawerContextComponent";
import BinanceWSContextComponent from "~/components/zerodha/_contexts/LiveData/BinanceWSContextComponent";
import { store } from "../../components/zerodha/_redux/store";
import StoreComponent from "../../components/zerodha/_redux/storeComponent";
import Main from "./main";

export default function ContextLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <BinanceWSContextComponent>
        <Provider store={store}>
          {/* <BackendWSContextComponent> */}
          <StoreComponent />
          <DrawerProvider>
            <Main >
              {children}
            </Main>
          </DrawerProvider>
          {/* </BackendWSContextComponent> */}
        </Provider>
      </BinanceWSContextComponent>
    </ToastProvider>
  );
}
