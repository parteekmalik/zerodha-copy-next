import { Dispatch, SetStateAction } from "react";

interface IWatchlistBittom {
  watchListNo: number;
  setWatchListNo: Dispatch<SetStateAction<number>>;
}
function WatchlistBittom({ watchListNo, setWatchListNo }: IWatchlistBittom) {
  return (
    <div className="flex cursor-pointer ">
      <div className="flex  w-full border-y-[1px] ">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((_, i) => {
          return (
            <div
              className={
                " grow  border-r-[1px] px-3 py-2 text-center hover:bg-[#f9f9f9] hover:text-[#fd9522] " +
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
        <div className=" w-[90px] p-2 text-right">settings</div>
      </div>
    </div>
  );
}

export default WatchlistBittom;
