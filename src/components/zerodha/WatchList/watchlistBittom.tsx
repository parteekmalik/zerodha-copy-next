import { useDispatch, useSelector } from "react-redux";
import { updateWatchListNo } from "~/components/zerodha/_redux/Slices/watchList";
import { RootState } from "~/components/zerodha/_redux/store";

function WatchlistBittom() {
  const watchListNo = useSelector((state: RootState) => state.watchList.ListNo);
  const dispatch = useDispatch();
  return (
    <div className="flex  w-full mt-auto border-y-[1px] ">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((_, i) => {
        return (
          <div
            className={
              " grow  border-r-[1px] px-3 py-2 text-center hover:bg-[#f9f9f9] hover:text-[#fd9522] " +
              (watchListNo === i && "bg-[#f9f9f9] text-[#fd9522]")
            }
            key={"watchlist" + i}
            onClick={() => dispatch(updateWatchListNo(i))}
          >
            {i}
          </div>
        );
      })}
      {/* implement setting popup */}
      <div className=" w-[90px] p-2 text-right">settings</div>
    </div>
  );
}

export default WatchlistBittom;
