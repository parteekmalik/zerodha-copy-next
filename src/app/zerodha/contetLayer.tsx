"use client";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import { ToastProvider } from "./_contexts/Toast/toast";
import DataContextComponent from "./_contexts/data/dataContextComponent";

export default function ContextLayer() {
  return (
    <ToastProvider>
      <DataContextComponent>
        <SymbolLiveContextComponent>
          {/* <SessionProvider session={session}> */}

          <Home />
          {/* </SessionProvider> */}
        </SymbolLiveContextComponent>
      </DataContextComponent>
    </ToastProvider>
  );
}
