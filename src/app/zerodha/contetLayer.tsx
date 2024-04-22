"use client";
import Home from "./Home";
import { ToastProvider } from "../../components/zerodha/_contexts/Toast/toast";
import BackendWSContextComponent from "../../components/zerodha/_contexts/backendWS/backendWSContextComponent";

import { Provider } from "react-redux";
import { store } from "../../components/zerodha/_redux/store";
import StoreComponent from "../../components/zerodha/_redux/storeComponent";

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
