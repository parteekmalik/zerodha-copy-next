import { useState } from "react";
import SymbolInWL from "./symbolInWL";
import { shadowBox } from "../tcss";

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
      <div className="flex ">
        <div className="flex  w-full border-y-[1px] ">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((_, i) => {
            return (
              <div
                className={
                  " grow cursor-pointer border-r-[1px] px-3 py-2 text-center hover:bg-[#f9f9f9] hover:text-[#fd9522] " +
                  (watchListNo === i && "bg-[#f9f9f9] text-[#fd9522]")
                }
                key={"watchlist" + i}
                onClick={() => setWatchListNo(i)}
              >
                {i}
              </div>
            );
          })}
          {/* implement setting popup */}
          <div className=" p-2">sett</div>
        </div>
      </div>
    </div>
  );
}

export default WatchList;
