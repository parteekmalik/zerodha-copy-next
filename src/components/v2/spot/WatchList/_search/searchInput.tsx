import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { searchAndSort } from "~/app/v1/utils";
import { type RootState } from "~/components/zerodha/_redux/store";
import { SearchIcon } from "~/components/zerodha/savages/searchIcon";
import SearchList from "./searchList";
import { ScrollArea } from "~/components/v2/ui/scroll-area";

function SearchInput({
  submitUpdate,
  setSearch,
  search,
}: {
  submitUpdate: (index: number) => void;
  search: {
    focus: boolean;
    data: string;
    Selected: number;
    matchingSymbol: string[];
  };
  setSearch: Dispatch<
    SetStateAction<{
      focus: boolean;
      matchingSymbol: string[];
      data: string;
      Selected: number;
    }>
  >;
}) {
  const watchLists = useSelector((state: RootState) => state.watchList);
  const watchList = watchLists.List[watchLists.ListNo] ?? [];

  
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (search.focus) inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [search.focus]);

  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  useEffect(() => {
    const temp = searchAndSort(search.data, Object.keys(symbolsList), watchList);

    if (temp.length > 0)
      setSearch((prev) => {
        return { ...prev, matchingSymbol: temp };
      });
  }, [search.data, watchList]);

  return (
    <div className=" relative z-10 min-h-[50px] min-w-[0px]">
      <div className="flex items-center justify-center p-3">
        <div className=" h-[15px] w-[15px]">
          <SearchIcon fill="fill-foreground" />
        </div>
        <input
          ref={inputRef}
          className="boarder-[0px] grow bg-background px-2 text-sm focus:outline-0"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Search eg: infy bse, nifty fut, nifty weekly, gold mcx"
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
            if (e.key === "Enter") {
              submitUpdate(search.Selected);
              e.currentTarget.blur();
            }
          }}
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
        <div className="text-darkGrayApp">{watchList.length} / 50</div>
      </div>
      {search.focus ? (
        <div className="absolute w-full text-[.8125rem]">
          <ScrollArea className="h-[40vh] overflow-y-auto">
            <SearchList search={search} updateWatchList={submitUpdate} setSearch={setSearch} />
          </ScrollArea>
        </div>
      ) : null}
    </div>
  );
}

export default SearchInput;
