import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { shadowBox } from "../tcss";
import SymbolInWL from "./drag_drop_wishlist/symbolInWL";
import SearchInput from "./search/searchInput";
import SearchList from "./search/searchList";
import WatchlistBittom from "./watchlistBittom";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { searchAndSort } from "~/app/zerodha/utils";

export type Tsymbol = string;

function WatchList() {
  const symbolsList = useSelector((state: RootState) => state.symbolsList);

  const [search, setSearch] = useState({
    focus: false,
    matchingSymbol: [""],
    data: "",
    Selected: 0,
  });
  const watchList = useSelector((state: RootState) => state.watchList);

  const dispatch = useDispatch<AppDispatch>();

  const updateWatchListAPI = api.upadteAccountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      if (data) {
        dispatch(updateWatchList(data));
        setSearch((prev) => {
          return { ...prev, focus: false, data: "", Selected: 0 };
        });
      }
    },
  });
  const submitUpdate = useCallback(
    (index: number) => {
      console.log("UPDATING WATCHLIST -> ", search, index);
      updateWatchListAPI.mutate({
        name: [
          ...(watchList.List[watchList.ListNo] ?? []),
          search.matchingSymbol[index],
        ].join(" "),
        row: watchList.ListNo,
      });
    },
    [search.matchingSymbol, watchList],
  );

  return (
    <div
      className={
        "flex h-full w-[430px] min-w-[430px] select-none flex-col border bg-white " +
        shadowBox
      }
    >
      <SearchInput
        watchList={watchList.List[watchList.ListNo] ?? []}
        search={search}
        submitUpdate={submitUpdate}
        setSearch={setSearch}
      />
      <div
        className="relative z-10 flex h-full w-full flex-col"
        style={{ maxHeight: "calc(100% - 100px)" }}
      >
        <div
          className=" flex  h-full  flex-col overflow-x-hidden overflow-y-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <SymbolInWL
            list={watchList.List[watchList.ListNo] ?? []}
            setSearch={setSearch}
          />
        </div>
      </div>
      <div className="min-h-[50px]">
        <WatchlistBittom />
      </div>
    </div>
  );
}

export default WatchList;