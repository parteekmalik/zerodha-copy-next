"use client";
import Home from "./_components/Home";
import { ToastProvider } from "./_contexts/Toast/toast";
import BackendWSContextComponent from "./_contexts/backendWS/backendWSContextComponent";

import { Provider } from "react-redux";
import { store } from "./_redux/store";
import StoreComponent from "./_redux/storeComponent";
import { wsConnect } from "./_redux/middlewares/Bnance/modules";
import { useEffect } from "react";

export default function ContextLayer() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <BackendWSContextComponent>
          <StoreComponent />
          <Home />
        </BackendWSContextComponent>
      </Provider>
    </ToastProvider>
  );
}
