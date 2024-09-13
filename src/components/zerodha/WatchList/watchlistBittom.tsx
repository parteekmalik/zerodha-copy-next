import { useDispatch, useSelector } from "react-redux";
import { updateWatchListNo } from "~/components/zerodha/_redux/Slices/watchList";
import { RootState } from "~/components/zerodha/_redux/store";

function WatchlistBittom() {
  const watchListNo = useSelector((state: RootState) => state.watchList.ListNo);
  const dispatch = useDispatch();
  return (
    <div className="mt-auto  flex w-full cursor-pointer border-y-[1px] border-borderApp ">
      {Array.from({ length: 7 }).map((_, i) => {
        return (
          <div
            className={
              " hover:bg-lightGrayApp  grow border-r-[1px] border-borderApp px-3 py-2 text-center hover:text-orangeApp " +
              (watchListNo === i && "bg-lightGrayApp text-orangeApp")
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
