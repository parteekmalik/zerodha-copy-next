import { useContext, useEffect } from "react";
import { api } from "~/trpc/react";
import SymbolLiveContext, {
  TsymbolLive,
} from "../../_contexts/SymbolLive/SymbolLive";
import DataContext from "../../_contexts/data/data";
import type { IdataContextActions } from "../../_contexts/data/dataReduer";
import type { Tsymbol } from "./watchList";
import { string } from "zod";

export type WS_method = "SUBSCRIBE" | "UNSUBSCRIBE";
export type Twsbinance = {
  method: WS_method;
  params: string[];
  id: number;
};

interface ISymbolInWL {
  list: Tsymbol[] | undefined;
  listNo: number;
}
function SymbolInWL({ list, listNo }: ISymbolInWL) {
  const { symbolLiveState, socketSend } = useContext(SymbolLiveContext);
  // const { dataDispatch, dataState } = useContext(DataContext);

  useEffect(() => {
    if (!list) return;
    const msg: Twsbinance = {
      method: "SUBSCRIBE",
      params: [],
      id: 1,
    };
    list?.map((symbol) => {
      msg.params.push(symbol + "@trade");
    });
    socketSend(msg);
    return () => {
      if (!list) return;
      const msg: Twsbinance = {
        method: "UNSUBSCRIBE",
        params: [],
        id: 1,
      };
      list?.map((symbol) => {
        msg.params.push(symbol + "@trade");
      });
      socketSend(msg);
    };
  }, [list]);
  return (
    <>
      {list
        ? list.map((symbol) => {
            const symbolName = symbol.toUpperCase();
            const symbolLiveTemp = symbolLiveState.Livestream[symbolName];
            const diff = symbolLiveTemp?.isup ? 1 : -1;

            if (symbolLiveTemp)
              return (
                <div
                  className={
                    "group/item relative flex border-b p-[12px_15px]  hover:bg-[#f9f9f9] " +
                    getColor(diff)
                  }
                  style={{ fontSize: ".8125rem" }}
                  key={"symbol" + symbol}
                >
                  <BaseSymbolLayout
                    key={"watchlistItem_" + symbolName}
                    symbolName={symbolName}
                    symbolLiveTemp={symbolLiveTemp}
                  />
                  <div className=" invisible absolute right-0 top-0 flex h-full gap-2 p-[8px_15px_8px_2px] text-white group-hover/item:visible">
                    <HiddenLayout symbolName={symbolName} listNo={listNo} />
                  </div>
                </div>
              );
            else return null;
          })
        : null}
    </>
  );
}
function BaseSymbolLayout({
  symbolName,
  symbolLiveTemp,
}: {
  symbolName: string;
  symbolLiveTemp: TsymbolLive;
}) {
  const diff = symbolLiveTemp?.isup ? 1 : -1;
  return (
    <>
      <div className="grow">{symbolName}</div>
      <div className="flex">
        <div className="flex opacity-[.7]">
          <div className="pr-[3px] text-black opacity-[.65] ">
            {symbolLiveTemp?.PriceChange}
          </div>
          <div className="flex  w-[45px] min-w-[45px]  text-black  ">
            <div className="grow text-right">
              {symbolLiveTemp?.PriceChangePercent}
            </div>

            <span className="my-auto text-[.652rem]  ">%</span>
          </div>
        </div>
        <div className="flex ">
          <a
            className={
              ` px-2 font-semibold    ` +
              (diff > 0
                ? "rotate-90 after:content-['<']"
                : "rotate-90 after:content-['>']")
            }
          ></a>
          <a className="min-w-[60px] text-right">{symbolLiveTemp?.curPrice}</a>
        </div>
      </div>
    </>
  );
}
function HiddenLayout({
  symbolName,
  listNo,
}: {
  symbolName: string;
  listNo: number;
}) {
  const { dataDispatch, dataState } = useContext(DataContext);
  const hiddendata: {
    bgcolor: string;
    text_color: string;
    text: string;
    payload:
      | null
      | IdataContextActions
      | { Type: "delete_watchListItem" }
      | { Type: "Supdate_Pins"; pos: number };
  }[] = [
    {
      bgcolor: "bg-[#4184f3]",
      text_color: "text-white",
      text: "B",
      payload: {
        type: "update_FormData",
        payload: {
          ...dataState.FormData,
          isvisible: true,
          oderdetails: {
            ...dataState.FormData.oderdetails,
            orderType: "BUY",
          },
          symbol: symbolName,
          orderType: "MARKET",
        },
      },
    },
    {
      text_color: "text-white",
      bgcolor: "bg-[#ff5722]",

      text: "S",
      payload: {
        type: "update_FormData",
        payload: {
          ...dataState.FormData,
          isvisible: true,
          oderdetails: {
            ...dataState.FormData.oderdetails,
            orderType: "SELL",
          },
          symbol: symbolName,
          orderType: "MARKET",
        },
      },
    },
    {
      text_color: "text-black",
      bgcolor: " bg-white",
      text: "d",
      payload: null,
    },
    {
      text_color: " text-black",
      bgcolor: " bg-white",
      text: "C",
      payload: {
        type: "update_rightHandSide",
        payload: {
          type: "chart",
          symbol: symbolName,
          TimeFrame: "5",
        },
      },
    },
    {
      text_color: " text-black",
      bgcolor: " bg-white",
      text: "D",
      payload: { Type: "delete_watchListItem" },
    },
    {
      text_color: " text-black",
      bgcolor: " bg-white",
      text: "P1",
      payload: { Type: "Supdate_Pins", pos: 0 },
    },
    {
      text_color: " text-black",
      bgcolor: " bg-white",
      text: "P2",
      payload: { Type: "Supdate_Pins", pos: 1 },
    },
  ];
  const deleteApi = api.accountInfo.deleteIteminWatchList.useMutation({
    onSuccess: async (data) => {
      dataDispatch({ type: "update_watchList", payload: data });
    },
  });
  const updatePinApi = api.accountInfo.updatePins.useMutation({
    onSuccess: async (data) => {
      if (typeof data === "string") console.log(data);
      else dataDispatch({ type: "update_Pins", payload: data });
    },
  });
  return (
    <>
      {hiddendata.map(({ payload, text_color, bgcolor, text }) => {
        return (
          <div
            className={`h-full w-[35px] cursor-pointer rounded  p-[4px_10px] text-center hover:opacity-[.85] ${bgcolor} ${text_color}`}
            key={"hiddenitems" + text}
            onMouseUp={() => {
              if (payload) {
                console.log("clicked hidden elements payload ->", payload);
                if ("type" in payload) {
                  dataDispatch(payload);
                } else if (payload.Type === "Supdate_Pins") {
                  console.log("updatePin->");
                  updatePinApi.mutate({
                    name: symbolName,
                    pos: payload.pos,
                  });
                } else if (payload.Type === "delete_watchListItem") {
                  console.log("updatewatchliast->");
                  deleteApi.mutate({ name: symbolName, row: listNo });
                }
              }
            }}
          >
            {text}
          </div>
        );
      })}
    </>
  );
}
export default SymbolInWL;

const getColor = (diff: number) => {
  if (diff > 0) {
    return "text-[#4caf50]";
  } else if (diff < 0) {
    return "text-[#df514c]";
  } else {
    return "";
  }
};
