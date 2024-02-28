"use client";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import { type TuserDetails } from "./_contexts/data/data";
import DataContextComponent from "./_contexts/data/dataContextComponent";


export default function ContextLayer() {
  return (
    <DataContextComponent>
      <SymbolLiveContextComponent>
        <Home />
      </SymbolLiveContextComponent>
    </DataContextComponent>
  );
}
