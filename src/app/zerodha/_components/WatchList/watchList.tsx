import { useContext, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import DataContext from "../../_contexts/data/data";
import { shadowBox } from "../tcss";
import SymbolInWL from "./symbolInWL";
import WatchlistBittom from "./watchlistBittom";
import { api } from "~/trpc/react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import { searchAndSort } from "../../utils";

export type Tsymbol = string;

function WatchList() {
  const [watchListNo, setWatchListNo] = useState(0);
  const [search, setSearch] = useState<{
    data: string;
    focus: boolean;
    matchingSymbol: string[];
    selected: number;
  }>({
    data: "",
    focus: false,
    matchingSymbol: [],
    selected: 0,
  });
  const list = useContext(DataContext).dataState.watchList;
  const { dataDispatch } = useContext(DataContext);

  const updateWatchList = api.accountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      dataDispatch({ type: "update_watchList", payload: data });
      setSearch((prev) => {
        return { ...prev, data: "", focus: false };
      });
    },
  });

  const handleEnter = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateWatchList.mutate({
        name: search.matchingSymbol[search.selected] ?? "dummy_string",
        row: watchListNo,
      });
      e.currentTarget.blur();
    }
  };
  const { symbolLiveState } = useContext(SymbolLiveContext);

  useEffect(() => {
    console.log(search);
    const matchingSymbol = searchAndSort(
      search.data,
      Object.keys(symbolLiveState.symbolsList),
    );
    if (
      search.matchingSymbol.join("_") !== matchingSymbol.join("_") &&
      matchingSymbol.length > 0
    )
      setSearch((prev) => {
        return {
          ...prev,
          matchingSymbol,
        };
      });
    window.addEventListener("keydown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleClickOutside);
    };
  }, [search]);
  const handleClickOutside = (event: globalThis.KeyboardEvent) => {
    if (event.key === "ArrowUp")
      setSearch((prev) => ({
        ...prev,
        selected:
          prev.selected === 0
            ? prev.matchingSymbol.length - 1
            : prev.selected - 1,
      }));
    else if (event.key === "ArrowDown")
      setSearch((prev) => ({
        ...prev,
        selected:
          prev.selected === prev.matchingSymbol.length - 1
            ? 0
            : prev.selected + 1,
      }));
  };
  return (
    <div
      className={
        "flex h-full w-[430px] min-w-[430px] flex-col bg-white" + shadowBox
      }
    >
      <div className=" flex min-h-[50px] min-w-[0px] items-center justify-center border-b p-3">
        <div className=" h-[15px] w-[15px]">
          <SearchIcon />
        </div>
        <input
          className="boarder-[0px] grow px-2 text-sm focus:outline-0"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Search eg: infy bse, nifty fut, nifty weekly, gold mcx"
          onKeyDown={handleEnter}
          value={search.data}
          onChange={(e) =>
            setSearch((prev) => {
              return { ...prev, data: e.target.value };
            })
          }
          onFocus={() =>
            setSearch((prev) => {
              return { ...prev, focus: true };
            })
          }
          onBlur={() =>
            setSearch((prev) => {
              return { ...prev, focus: false, data: "" };
            })
          }
        />
        <div className="text-[#cccccc]">
          {list[watchListNo] ? list[watchListNo]?.length : 0} / 50
        </div>
      </div>
      <div
        className="relative flex h-full w-full flex-col"
        style={{ maxHeight: "calc(100% - 100px)" }}
      >
        {search.focus ? (
          <div className="absolute z-10 h-[40vh]  w-full overflow-y-auto text-[.8125rem]    ">
            <SearchList
              list={search.matchingSymbol}
              selected={search.selected}
            />
          </div>
        ) : null}
        <div className="custom-scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200    flex  grow flex-col overflow-y-auto">
          <SymbolInWL list={list[watchListNo]} listNo={watchListNo} />
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
function SearchList({ list, selected }: { list: string[]; selected: number }) {
  const { symbolLiveState } = useContext(SymbolLiveContext);

  return (
    <>
      {list.map((name, i) => {
        return (
          <div
            className={
              "flex w-full  p-[6px_15px] " +
              (i === selected ? " bg-[#f9f9f9]" : " bg-white")
            }
            key={"search" + name}
          >
            <div className="grow">{name}</div>
            <div>{symbolLiveState.symbolsList[name]?.name}</div>
          </div>
        );
      })}
    </>
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
