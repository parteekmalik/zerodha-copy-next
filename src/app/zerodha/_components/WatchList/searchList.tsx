import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import { searchAndSort } from "../../utils";
import { SearchClass } from "./watchList";

function SearchList({
  search,
  setSearch,
  updateWatchList,
  watchListNo,
}: {
  search: {
    focus: boolean;
    matchingSymbol: string[];
    data: string;
    Selected: number;
}
  setSearch: Dispatch<
    SetStateAction<{
      focus: boolean;
      matchingSymbol: string[];
      data: string;
      Selected: number;
  }>
  >;
  updateWatchList: (index: number) => void;
  watchListNo: number;
}) {
  const { symbolLiveState } = useContext(SymbolLiveContext);

  // const list = searchAndSort(input, Object.keys(symbolLiveState.symbolsList));
  const handleClickOutside = (event: globalThis.KeyboardEvent) => {
    if (event.key === "ArrowUp")
      setSearch((prev) => ({
        ...prev,
        Selected:
          prev.Selected === 0
            ? prev.matchingSymbol.length - 1
            : prev.Selected - 1,
      }));
    else if (event.key === "ArrowDown")
      setSearch((prev) => ({
        ...prev,
        Selected:
          prev.Selected === prev.matchingSymbol.length - 1
            ? 0
            : prev.Selected + 1,
      }));
  };
  useEffect(() => {
    console.log(search);

    window.addEventListener("keydown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {search.matchingSymbol.map((name, i) => {
        return (
          <div
            className={
              "flex w-full  p-[6px_15px] " +
              (i === search.Selected ? " bg-[#f9f9f9]" : " bg-white")
            }
            onClick={(e) => {
              updateWatchList(i);
            }}
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

export default SearchList;
