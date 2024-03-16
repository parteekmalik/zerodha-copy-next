"use client";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import DataContextComponent from "./_contexts/data/dataContextComponent";

export default function ContextLayer({ isLogedin }: { isLogedin: boolean }) {

  return (
    <DataContextComponent>
      <SymbolLiveContextComponent>
        <Home isLogedin={isLogedin} />
      </SymbolLiveContextComponent>
    </DataContextComponent>
  );
}
