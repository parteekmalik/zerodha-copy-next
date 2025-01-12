import { useDispatch, useSelector } from "react-redux";
import { updateWatchListNo } from "~/components/zerodha/_redux/Slices/watchList";
import { type RootState } from "~/components/zerodha/_redux/store";

function WatchlistBittom() {
  const watchListNo = useSelector((state: RootState) => state.watchList.ListNo);
  const dispatch = useDispatch();
  return (
    <div className="mt-auto flex w-full cursor-pointer border-y-[1px]  ">
      {Array.from({ length: 7 }).map((_, i) => {
        return (
          <div
            className={
              " grow  border-r-[1px] px-3  py-2 text-center hover:bg-lightGrayApp hover:text-primary " +
              (watchListNo === i && "bg-lightGrayApp text-primary")
            }
            key={"watchlist" + i}
            onClick={() => dispatch(updateWatchListNo(i))}
          >
            {i}
          </div>
        );
      })}
    </div>
  );
}

export default WatchlistBittom;
