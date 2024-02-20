"use client";
import Home from "./_components/Home";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";
import { type TuserDetails } from "./_contexts/data/data";
import DataContextComponent from "./_contexts/data/dataContextComponent";

interface IHome {
  watchlist: string[][];
  userDetails: TuserDetails;
}
export default function ContextLayer({ watchlist, userDetails }: IHome) {
  return (
    <SymbolLiveContextComponent>
      <DataContextComponent>
        <Home watchlist={watchlist} userDetails={userDetails} />
      </DataContextComponent>
    </SymbolLiveContextComponent>
  );
}
