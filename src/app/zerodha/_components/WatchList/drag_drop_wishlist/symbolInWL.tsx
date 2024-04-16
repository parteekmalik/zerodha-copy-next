import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchList } from "~/app/zerodha/_redux/Slices/watchList";
import { AppDispatch, RootState } from "~/app/zerodha/_redux/store";
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
}
function SymbolInWL({ list: DataList }: ISymbolInWL) {
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
  if (!LocalList) return null;
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
