import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWatchList } from "~/app/zerodha/_redux/Slices/watchList";
import { AppDispatch, RootState, socketSend } from "~/app/zerodha/_redux/store";
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
  listNo: number;
}
function SymbolInWL({ list: DataList, listNo }: ISymbolInWL) {
  // const { socketSend } = useContext(SymbolLiveContext);
  const Livestream = useSelector((state: RootState) => state.Livestream.LiveData);

  const [list, setList] = useState<Tsymbol[]>([]);
  // const [selected, setSelected] = useState(null);

  useEffect(() => {
    setList(DataList);
    // console.log("useEffect -> ", DataList);
  }, [DataList]);

  useEffect(() => {
    if (!DataList) return;
    const msg: Twsbinance = {
      method: "SUBSCRIBE",
      params: [],
      id: 2,
    };
    DataList?.map((symbol) => {
      msg.params.push(symbol + "@trade");
    });
    // console.log("message sent->", msg);
    socketSend(msg);
    // return () => {
    //   if (!DataList) return;
    //   const msg: Twsbinance = {
    //     method: "UNSUBSCRIBE",
    //     params: [],
    //     id: 2,
    //   };
    //   DataList?.map((symbol) => {
    //     msg.params.push(symbol + "@trade");
    //   });
    //   socketSend(msg);
    // };
  }, [DataList]);

  const dispatch = useDispatch<AppDispatch>();

  const updateWatchListAPI = api.accountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      if (data) dispatch(updateWatchList(data));
    },
  });
  function submitUpdate() {
    console.log("symbolinwl");
    updateWatchListAPI.mutate({
      name: list.join(" "),
      row: listNo,
    });
  }
  if (!list) return null;
  return (
    <>
      <Reorder.Group
        values={list}
        onReorder={(e) => {
          // console.log(e);
          setList(e);
        }}
        axis="y"
      >
        {list.map((symbol) => {
          const symbolName = symbol.toUpperCase();
          return (
            <Item
              diff={Livestream[symbolName]?.isup ? 1 : -1}
              symbolLiveTemp={Livestream[symbolName]}
              symbolName={symbolName}
              listNo={listNo}
              submitUpdate={submitUpdate}
              key={symbolName}
            />
          );
        })}
      </Reorder.Group>
    </>
  );
}

export default SymbolInWL;
