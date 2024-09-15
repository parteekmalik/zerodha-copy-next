import { Reorder } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { useBinanceLiveData } from "../../../../components/zerodha/_contexts/LiveData/useBinanceLiveData";
import type { Tsymbol } from "../page";
import Item from "./Item";
import { updateSeprateSubscriptions } from "../../../../components/zerodha/_redux/Slices/BinanceWSStats";

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

  useEffect(() => {
    setLocalList(list);
    dispatch(
      updateSeprateSubscriptions({ name: "watchList", subsription: list }),
    );
  }, [list]);

  const dispatch = useDispatch<AppDispatch>();
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
    [listNo, LocalList],
  );

  if (!LocalList.length)
    return (
      <div className="flex w-full  flex-col items-center justify-center ">
        <img
          style={{ width: "100px", height: "100px" }}
          src="https://kite.zerodha.com/static/images/illustrations/marketwatch.svg"
          alt="Market Watch"
        />
        <div className=" mb-[20px]">
          <h2 className="text-center text-[1.225rem] text-textDark">
            Nothing here
          </h2>
          <p className="text-center text-[.8125rem] text-darkGrayApp">
            Use the search bar to add instruments.
          </p>
        </div>
        <button
          className="cursor-pointer rounded bg-blueApp p-[10px_20px] text-[.925rem] text-white opacity-90"
          onClick={() =>
            setSearch({
              focus: true,
              matchingSymbol: [],
              data: "",
              Selected: 0,
            })
          }
        >
          ADD instrument
        </button>
      </div>
    );
  return (
    <Reorder.Group
      values={LocalList}
      onReorder={(e) => setLocalList(e)}
      axis="y"
      dragMomentum={false}
    >
      {LocalList.map((symbol) => {
        const symbolName = symbol.toUpperCase();
        return (
          <Item
            isup={Livestream[symbolName]?.isup ?? 0}
            symbolLiveTemp={Livestream[symbolName]}
            symbolName={symbolName}
            submitUpdate={submitUpdate}
            key={symbolName}
          />
        );
      })}
    </Reorder.Group>
  );
}

export default SymbolInWL;
