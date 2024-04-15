"use client";
import Home from "./_components/Home";
import { ToastProvider } from "./_contexts/Toast/toast";
import BackendWSContextComponent from "./_contexts/backendWS/backendWSContextComponent";

import { Provider } from "react-redux";
import { store } from "./_redux/store";
import StoreComponent from "./_redux/storeComponent";

export default function ContextLayer() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <BackendWSContextComponent>
          {/* <SessionProvider session={session}> */}
          <StoreComponent />
          <Home />
          {/* </SessionProvider> */}
        </BackendWSContextComponent>
      </Provider>
    </ToastProvider>
  );
}
