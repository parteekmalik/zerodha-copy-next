import { Dispatch, SetStateAction, useState } from "react";
import { shadowBox } from "../tcss";
import SymbolInWL from "./symbolInWL";
import WatchlistBittom from "./watchlistBittom";
import { Tdata } from "../../page";

export interface IWatchList {
  data: Tsymbol[][];
  setData : Dispatch<SetStateAction<Tdata>>
}
export type Tsymbol = { name: string;  };

function WatchList({ data: list ,setData }: IWatchList) {
  const [watchListNo, setWatchListNo] = useState(0);
  

  return (
    <div className={"flex w-[430px] flex-col bg-white" + shadowBox}>
      <div className="flex min-w-[0px] items-center justify-center border-b p-3">
        <div className=" h-[15px] w-[15px]">
          <SearchIcon />
        </div>
        <input
          className="grow px-2 text-sm boarder-[0px] focus:outline-0"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Search eg: infy bse, nifty fut, nifty weekly, gold mcx"
        />
        <div className="text-[#cccccc]">
          {list[watchListNo] ? list[watchListNo]?.length : 0} / 50
        </div>
      </div>
      <SymbolInWL list={list[watchListNo]} setData={setData} />
      <WatchlistBittom
        watchListNo={watchListNo}
        setWatchListNo={setWatchListNo}
      />
    </div>
  );
}
const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="auto"
      height="auto"
      viewBox="0 0 50 50"
    >
      <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
    </svg>
  );
};
export default WatchList;
