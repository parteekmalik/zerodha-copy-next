import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { searchAndSort } from "~/app/v1/utils";
import { type RootState } from "../../../../components/zerodha/_redux/store";
import { SearchIcon } from "../../../../components/zerodha/savages/searchIcon";
import SearchList from "./searchList";

function SearchInput({
  submitUpdate,
  setSearch,
  watchList,
  search,
}: {
  watchList: string[];
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
  }, [search.data, search.focus, watchList, symbolsList, setSearch]);

  return (
    <div className=" relative z-10 min-h-[50px] min-w-[0px]">
      <div className="  flex  items-center justify-center border-b border-borderApp p-3">
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
        <div
          className="absolute h-[40vh] w-full overflow-y-auto text-[.8125rem]"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          <SearchList search={search} updateWatchList={submitUpdate} setSearch={setSearch} />
        </div>
      ) : null}
    </div>
  );
}

export default SearchInput;
