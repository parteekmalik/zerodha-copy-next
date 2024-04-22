import { Reorder } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import type { Tsymbol } from "../watchList";
import Item from "./Item";

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
function SymbolInWL({ list: DataList, setSearch }: ISymbolInWL) {
  // const { socketSend } = useContext(SymbolLiveContext);
  const Livestream = useSelector((state: RootState) => state.Livestream);
  const headerPin = useSelector((state: RootState) => state.headerPin);

  const [LocalList, setLocalList] = useState<Tsymbol[]>([]);

  useEffect(() => {
    setLocalList(DataList);
  }, [DataList]);

  const dispatch = useDispatch<AppDispatch>();
  const listNo = useSelector((state: RootState) => state.watchList.ListNo);

  const updateWatchListAPI = api.accountInfo.updateWatchList.useMutation({
    onSuccess: (data) => {
      if (data) dispatch(updateWatchList(data));
    },
  });
  function submitUpdate() {
    updateWatchListAPI.mutate({
      name: LocalList.join(" "),
      row: listNo,
    });
  }
  if (!LocalList.length)
    return (
      <div className="flex w-full  flex-col items-center justify-center ">
        <img
          style={{ width: "100px", height: "100px" }}
          src="https://kite.zerodha.com/static/images/illustrations/marketwatch.svg"
          alt="Market Watch"
        />
        <div className=" mb-[20px]">
          <h2 className="text-center text-[1.225rem] text-[#444444]">
            Nothing here
          </h2>
          <p className="text-center text-[.8125rem] text-[#9b9b9b]">
            Use the search bar to add instruments.
          </p>
        </div>
        <button
          className="cursor-pointer rounded bg-[#4183f3] p-[10px_20px] text-[.925rem] text-white"
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
    >
      {LocalList.map((symbol) => {
        const symbolName = symbol.toUpperCase();
        return (
          <Item
            diff={Livestream[symbolName]?.isup ? 1 : -1}
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
