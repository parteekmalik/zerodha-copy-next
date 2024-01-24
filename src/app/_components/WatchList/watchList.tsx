import { useState } from "react";
import SymbolInWL from "./symbolInWL";
import { shadowBox } from "../tcss";
import WatchlistBittom from "./watchlistBittom";

export interface IWatchList {
  data: Tsymbol[][];
}
export type Tsymbol = { name: string; prevDayClose: number; curPrice: number };

function WatchList({ data: list }: IWatchList) {
  const [watchListNo, setWatchListNo] = useState(0);

  return (
    <div className={"flex w-[430px] flex-col bg-white" + shadowBox}>
      <div className="flex min-w-[0px] justify-center border-b p-3">
        <div></div>
        <input
          type="text"
          placeholder="Search eg: infy bse, nifty fut, nifty weekly, gold mcx"
        />
        <div></div>
      </div>
      <SymbolInWL list={list[watchListNo]} />
      <WatchlistBittom watchListNo={watchListNo} setWatchListNo={setWatchListNo}/>
    </div>
  );
}

export default WatchList;
