import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { AppDispatch, RootState } from "../../_redux/store";
import { updateWatchList } from "../../_redux/watchList/watchList";
import { searchAndSort } from "../../utils";
import { shadowBox } from "../tcss";
import SymbolInWL from "./drag_drop_wishlist/symbolInWL";
import SearchInput from "./search/searchInput";
import SearchList from "./search/searchList";
import WatchlistBittom from "./watchlistBittom";

export type Tsymbol = string;

function WatchList() {
  const [watchListNo, setWatchListNo] = useState(0);
  const symbolsList = useSelector((state: RootState) => state.symbolsList);

  const [search, setSearch] = useState({
    focus: false,
    matchingSymbol: [""],
    data: "",
    Selected: 0,
  });
  const list = useSelector((state: RootState) => state.watchList);

  const dispatch = useDispatch<AppDispatch>();

  const updateWatchListAPI = api.accountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      if (data) {
        dispatch(updateWatchList(data));
        setSearch((prev) => {
          return { ...prev, focus: false, data: "", Selected: 0 };
        });
      }
    },
  });
  function submitUpdate(index: number) {
    console.log("UPDATING WATCHLIST -> ", search, index);
    updateWatchListAPI.mutate({
      name: [...(list[watchListNo] ?? []), search.matchingSymbol[index]].join(
        " ",
      ),
      row: watchListNo,
    });
  }

  useEffect(() => {
    const temp = searchAndSort(
      search.data,
      Object.keys(symbolsList),
      list[watchListNo] ?? [],
    );
    if (
      search.focus &&
      temp.length > 0 &&
      temp.join("") !== search.matchingSymbol.join("")
    )
      setSearch((prev) => {
        return { ...prev, matchingSymbol: temp };
      });
  }, [search]);

  return (
    <div
      className={
        "z-10 flex h-full w-[430px] min-w-[430px] flex-col bg-white " +
        shadowBox
      }
    >
      <SearchInput
        symbolCount={list[watchListNo]?.length ?? 0}
        search={search}
        submitUpdate={submitUpdate}
        setSearch={setSearch}
      />
      <div
        className="relative flex h-full w-full flex-col"
        style={{ maxHeight: "calc(100% - 100px)" }}
      >
        {search.focus ? (
          <div className="absolute z-10 h-[40vh]  w-full overflow-y-auto text-[.8125rem]    ">
            <SearchList
              search={search}
              updateWatchList={submitUpdate}
              setSearch={setSearch}
            />
          </div>
        ) : null}
        <div className="custom-scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200  flex  grow  flex-col overflow-y-auto overflow-x-hidden">
          <SymbolInWL list={list[watchListNo] ?? []} listNo={watchListNo} />
        </div>
      </div>
      <div className="min-h-[50px]">
        <WatchlistBittom
          watchListNo={watchListNo}
          setWatchListNo={setWatchListNo}
        />
      </div>
    </div>
  );
}

export default WatchList;
