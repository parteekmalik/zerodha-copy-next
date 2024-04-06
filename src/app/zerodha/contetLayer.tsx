"use client";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import { ToastProvider } from "./_contexts/Toast/toast";
import BackndWSContext, {
  BackndWSContextConsumer,
} from "./_contexts/backendWS/backendWS";
import BackendWSContextComponent from "./_contexts/backendWS/backendWSContextComponent";
import DataContextComponent from "./_contexts/data/dataContextComponent";

export default function ContextLayer() {
  return (
    <ToastProvider>
      <SymbolLiveContextComponent>
        <DataContextComponent>
          <BackendWSContextComponent>
            {/* <SessionProvider session={session}> */}
            <Home />
            {/* </SessionProvider> */}
          </BackendWSContextComponent>
        </DataContextComponent>
      </SymbolLiveContextComponent>
    </ToastProvider>
  );
}
