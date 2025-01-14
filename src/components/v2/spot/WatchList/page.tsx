"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timeOptions, useChart } from "~/components/v2/contexts/chartContext";
import { Card, CardContent, CardHeader } from "~/components/v2/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/v2/ui/select";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { type AppDispatch, type RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import SymbolInWL from "./_drag_drop_wishlist/symbolInWL";
import WatchlistBittom from "./watchlistBittom";

export type Tsymbol = string;

function WatchList() {
  const { symbolSelected, setSymbolSelected, timeSelected, setTimeSelected } = useChart();
  const symbolsList = useSelector((state: RootState) => state.symbolsList);

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
    <Card className="bg-baackground mr-1 flex flex-col border-2">
      <CardHeader className="my-2 gap-1 flex flex-row p-0 space-y-0">
        <Select defaultValue="BTCUSDT" value={symbolSelected} onValueChange={(value) => setSymbolSelected(value)}>
          <SelectTrigger className="hide-last-of-first-child  border border-primary/30 rounded-lg bg-primary/30 text-xl text-white shadow-md transition duration-200 ease-in-out hover:bg-primary/10">
            <SelectValue placeholder="Select a symbol" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            <SelectGroup className="text-lg">
              {Object.keys(symbolsList).map((symbol) => (
                <SelectItem key={symbol} value={symbol} className="hover:bg-primary/10">
                  <p>{symbol}</p>
                  <p>{symbolsList[symbol]?.name}</p>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue="5m" value={timeSelected} onValueChange={(value) => setTimeSelected(value as (typeof timeOptions)[number])}>
          <SelectTrigger  className="w-fit rounded-lg border border-primary text-lg text-white shadow-md transition duration-200 ease-in-out hover:bg-primary/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            <SelectGroup className="text-lg">
              {timeOptions.map((symbol) => (
                <SelectItem key={symbol} value={symbol} className="hover:bg-primary/10 ">
                  {Number.isNaN(Number(symbol)) ? symbol : symbol + "min"}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex grow select-none flex-col gap-1 overflow-hidden rounded-lg bg-background p-0 lg:w-[400px]">
        {/* <SearchInput search={search} submitUpdate={submitUpdate} setSearch={setSearch} /> */}
        <div className="relative flex w-full grow flex-col" style={{ maxHeight: "calc(100% - 100px)" }}>
          <div className="flex h-full flex-col " style={{ scrollbarWidth: "thin" }}>
            <SymbolInWL list={watchList.List[watchList.ListNo] ?? []} setSearch={setSearch} />
          </div>
        </div>
        <WatchlistBittom />
      </CardContent>
    </Card>
  );
}

export default WatchList;
