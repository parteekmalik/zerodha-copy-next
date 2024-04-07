"use client";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import { ToastProvider } from "./_contexts/Toast/toast";
import BackendWSContextComponent from "./_contexts/backendWS/backendWSContextComponent";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import StoreComponent from "./redux/storeComponent";

export default function ContextLayer() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <SymbolLiveContextComponent>
          <BackendWSContextComponent>
            {/* <SessionProvider session={session}> */}
            <StoreComponent />
            <Home />
            {/* </SessionProvider> */}
          </BackendWSContextComponent>
        </SymbolLiveContextComponent>
      </Provider>
    </ToastProvider>
  );
}
