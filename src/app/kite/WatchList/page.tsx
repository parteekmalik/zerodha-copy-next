"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { type AppDispatch, type RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { shadowBox } from "../../../components/zerodha/tcss";
import SymbolInWL from "./_drag_drop_wishlist/symbolInWL";
import SearchInput from "./_search/searchInput";
import WatchlistBittom from "./watchlistBittom";

export type Tsymbol = string;

function WatchList() {
  const [search, setSearch] = useState({
    focus: false,
    matchingSymbol: [] as string[],
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
      console.log("UPDATING WATCHLIST -> ", search.matchingSymbol, index);
      updateWatchListAPI.mutate({
        name: [...(watchList.List[watchList.ListNo] ?? []), search.matchingSymbol[index]].join(" "),
        row: watchList.ListNo,
      });
    },
    [search.matchingSymbol, watchList, updateWatchListAPI],
  );

  return (
    <div
      className={
        "flex h-full min-w-full select-none  flex-col border border-t-0 border-borderApp bg-background lg:min-w-[430px] " +
        shadowBox
      }
    >
      <SearchInput
        watchList={watchList.List[watchList.ListNo] ?? []}
        search={search}
        submitUpdate={submitUpdate}
        setSearch={setSearch}
      />
      <div className="relative flex h-full w-full flex-col" style={{ maxHeight: "calc(100% - 100px)" }}>
        <div className=" flex  h-full  flex-col overflow-x-hidden overflow-y-scroll" style={{ scrollbarWidth: "thin" }}>
          <SymbolInWL list={watchList.List[watchList.ListNo] ?? []} setSearch={setSearch} />
        </div>
      </div>
      <WatchlistBittom />
    </div>
  );
}

export default WatchList;
