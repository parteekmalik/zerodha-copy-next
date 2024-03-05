import { useContext } from "react";
import { TsymbolLive } from "../../_contexts/SymbolLive/SymbolLive";
import DataContext from "../../_contexts/data/data";
import { IdataContextActions } from "../../_contexts/data/dataReduer";
import { api } from "~/trpc/react";

export function BaseSymbolLayout({
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
export function HiddenLayout({
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
          type: "BUY",
          symbol: symbolName,
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
          type: "SELL",
          symbol: symbolName,
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
  const deleteApi = api.accountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      dataDispatch({ type: "update_watchList", payload: data });
    },
  });
  function deleteFunc(symbol: string) {
    symbol = symbol.toUpperCase();
    let list = dataState.watchList[listNo];
    // console.log("delete api ->", list, symbol);
    list = list?.filter((item) => item !== symbol);
    // console.log("delete api ->", list);
    deleteApi.mutate({ name: list?.join(" ") ?? "", row: listNo });
  }
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
            onClick={() => {
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
                  deleteFunc(symbolName);
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
