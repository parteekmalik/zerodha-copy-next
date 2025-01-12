import { Reorder } from "framer-motion";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { type AppDispatch, type RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import type { Tsymbol } from "../page";
import Item from "./Item";
import { updateSeprateSubscriptions } from "~/components/zerodha/_redux/Slices/BinanceWSStats";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import { Button } from "~/components/v2/ui/button";

export type WS_method = "SUBSCRIBE" | "UNSUBSCRIBE";
export type Twsbinance = {
  method: WS_method;
  params: string[];
  id: number;
};

interface ISymbolInWL {
  list: Tsymbol[];
  setSearch: Dispatch<
    SetStateAction<{
      focus: boolean;
      matchingSymbol: string[];
      data: string;
      Selected: number;
    }>
  >;
}
function SymbolInWL({ list, setSearch }: ISymbolInWL) {
  // const { socketSend } = useContext(SymbolLiveContext);
  const { Livestream } = useBinanceLiveData();

  const [LocalList, setLocalList] = useState<Tsymbol[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setLocalList(list);
    dispatch(updateSeprateSubscriptions({ name: "watchList", subsription: list }));
  }, [list, dispatch, setLocalList]);

  const listNo = useSelector((state: RootState) => state.watchList.ListNo);

  const updateWatchListAPI = api.upadteAccountInfo.updateWatchList.useMutation({
    onSuccess: (data) => {
      if (data) dispatch(updateWatchList(data));
    },
  });
  const submitUpdate = useCallback(
    () =>
      updateWatchListAPI.mutate({
        name: LocalList.join(" "),
        row: listNo,
      }),
    [listNo, LocalList, updateWatchListAPI],
  );

  if (LocalList.length)
    return (
      <>
        <Reorder.Group values={LocalList} onReorder={(e) => setLocalList(e)} axis="y" dragMomentum={false}>
          {LocalList.map((symbol) => {
            const symbolName = symbol.toUpperCase();
            return (
              <Item
                isup={Livestream[symbolName]?.isup ?? "same"}
                symbolLiveTemp={Livestream[symbolName]}
                symbolName={symbolName}
                submitUpdate={submitUpdate}
                key={symbolName}
              />
            );
          })}
        </Reorder.Group>
        <Button
          variant={"outline"}
          className="mt-4 flex w-fit cursor-pointer border-primary/50 hover:border-primary/20 items-center self-center rounded  p-[10px_20px] text-[.925rem] font-semibold text-white"
          onClick={() =>
            setSearch({
              focus: true,
              matchingSymbol: [],
              data: "",
              Selected: 0,
            })
          }
        >
          <FaPlus className="mr-2" />
          ADD instrument
        </Button>
      </>
    );
  else
    return (
      <div className="flex w-full  flex-col items-center justify-center ">
        <Image width={100} height={100} src="https://kite.zerodha.com/static/images/illustrations/marketwatch.svg" alt="Market Watch" />
        <div className=" mb-[20px]">
          <h2 className="text-center text-[1.225rem] text-textDark">Nothing here</h2>
          <p className="text-center text-[.8125rem] text-darkGrayApp">Use the search bar to add instruments.</p>
        </div>
        <button
          className="flex cursor-pointer items-center rounded bg-primary p-[10px_20px] text-[.925rem] font-semibold text-white opacity-90"
          onClick={() =>
            setSearch({
              focus: true,
              matchingSymbol: [],
              data: "",
              Selected: 0,
            })
          }
        >
          <FaPlus className="mr-2" />
          ADD instrument
        </button>
      </div>
    );
}

export default SymbolInWL;
