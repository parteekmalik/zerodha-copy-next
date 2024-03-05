import { Reorder } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import DataContext from "../../_contexts/data/data";
import Item from "./Item";
import type { Tsymbol } from "./watchList";
import { api } from "~/trpc/react";

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
  const { symbolLiveState, socketSend } = useContext(SymbolLiveContext);
  const { dataDispatch, dataState } = useContext(DataContext);

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
    return () => {
      if (!DataList) return;
      const msg: Twsbinance = {
        method: "UNSUBSCRIBE",
        params: [],
        id: 2,
      };
      DataList?.map((symbol) => {
        msg.params.push(symbol + "@trade");
      });
      socketSend(msg);
    };
  }, [DataList]);

  const updateWatchList = api.accountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      dataDispatch({ type: "update_watchList", payload: data });
    },
  });
  function submitUpdate(list: string[]) {
    updateWatchList.mutate({
      name: list.join(" ") ?? "dummy_string",
      row: listNo,
    });
  }

  if (!list) return null;
  return (
    <>
      <Reorder.Group
        values={list}
        onMouseUp={(e) => {
          console.log("mouseup ->", list);
          submitUpdate(list);
        }}
        onReorder={(e) => setList(e)}
        axis="y"
      >
        {list.map((symbol) => {
          const symbolName = symbol.toUpperCase();
          return (
            <Item
              diff={symbolLiveState.Livestream[symbolName]?.isup ? 1 : -1}
              symbolLiveTemp={symbolLiveState.Livestream[symbolName]}
              symbolName={symbolName}
              listNo={listNo}
              key={symbolName}
            />
          );
        })}
      </Reorder.Group>
      {/* <div>{JSON.stringify(list)}</div> */}
    </>
  );
}

export default SymbolInWL;
