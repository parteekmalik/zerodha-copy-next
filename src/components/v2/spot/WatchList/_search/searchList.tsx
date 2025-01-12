import { type Dispatch, type SetStateAction, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "~/components/zerodha/_redux/store";

function SearchList({
  search,
  setSearch,
  updateWatchList,
}: {
  search: {
    focus: boolean;
    matchingSymbol: string[];
    data: string;
    Selected: number;
  };
  setSearch: Dispatch<
    SetStateAction<{
      focus: boolean;
      matchingSymbol: string[];
      data: string;
      Selected: number;
    }>
  >;
  updateWatchList: (index: number) => void;
}) {
  const symbolsList = useSelector((state: RootState) => state.symbolsList);

  const handleClickOutside = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowUp")
        setSearch((prev) => ({
          ...prev,
          Selected: prev.Selected === 0 ? prev.matchingSymbol.length - 1 : prev.Selected - 1,
        }));
      else if (event.key === "ArrowDown")
        setSearch((prev) => ({
          ...prev,
          Selected: prev.Selected === prev.matchingSymbol.length - 1 ? 0 : prev.Selected + 1,
        }));
    },
    [setSearch],
  );
  useEffect(() => {
    window.addEventListener("keydown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleClickOutside);
    };
  }, [handleClickOutside]);
  return (
    <>
      {search.matchingSymbol.map((name, i) => {
        return (
          <div
            className={"flex w-full  p-[6px_15px] " + (i === search.Selected ? " bg-[#1F365B]" : " bg-background")}
            onMouseDown={() => {
              updateWatchList(i);
            }}
            onMouseEnter={() => {
              setSearch((prev) => {
                return { ...prev, Selected: i };
              });
            }}
            onMouseLeave={() => {
              setSearch((prev) => {
                return { ...prev, Selected: 0 };
              });
            }}
            key={"search" + name}
          >
            <div className="grow">{name}</div>
            <div>{symbolsList[name]?.name}</div>
          </div>
        );
      })}
    </>
  );
}

export default SearchList;
