"use client";
import { SessionProvider } from "next-auth/react";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import DataContextComponent from "./_contexts/data/dataContextComponent";

export default function ContextLayer() {
  return (
    <DataContextComponent>
      <SymbolLiveContextComponent>
        {/* <SessionProvider session={session}> */}
          <Home />
        {/* </SessionProvider> */}
      </SymbolLiveContextComponent>
    </DataContextComponent>
  );
}
