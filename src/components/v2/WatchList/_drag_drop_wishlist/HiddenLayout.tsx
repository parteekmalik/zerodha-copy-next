import { useDispatch, useSelector } from "react-redux";

import { updateFormData } from "~/components/zerodha/_redux/Slices/FormData";
import { updateHeaderPin } from "~/components/zerodha/_redux/Slices/headerPin";

import { twMerge } from "tailwind-merge";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { type AppDispatch, type RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { type TsymbolLive } from "~/components/zerodha/_contexts/LiveData/BinanceWS";
import { useChart } from "~/components/v2/contexts/chartContext";
type IdataContextActions =
  | {
      type: "update_rightHandSide";
    }
  | {
      type: "update_watchList";
      payload: string[][];
    }
  | {
      type: "update_FormData";
    };
export function BaseSymbolLayout({ symbolName, symbolLiveTemp }: { symbolName: string; symbolLiveTemp: TsymbolLive | undefined }) {
  const isUp = symbolLiveTemp?.isup ?? "same";
  return (
    <>
      <div className="grow">{symbolName}</div>
      <div className="flex">
        <div className="flex opacity-[.7]">
          <div className="pr-[3px] text-foreground/65 ">{symbolLiveTemp?.PriceChange}</div>
          <div className="flex  w-[45px] min-w-[45px]  text-foreground  ">
            <div className="grow text-right">{symbolLiveTemp?.PriceChangePercent}</div>

            <span className="my-auto text-[.652rem]  ">{symbolLiveTemp && "%"}</span>
          </div>
        </div>
        <div className="flex ">
          {symbolLiveTemp && (
            <a
              className={twMerge(
                "px-2 font-semibold",
                isUp === "up" && "rotate-90 after:content-['<']",
                isUp === "down" && "rotate-90 after:content-['>']",
              )}
            ></a>
          )}
          <a className="min-w-[60px] text-right">{symbolLiveTemp?.curPrice}</a>
        </div>
      </div>
    </>
  );
}
type payloadT = null | IdataContextActions | { Type: "delete_watchListItem" } | { Type: "Supdate_Pins"; pos: number };
export function HiddenLayout({ symbolName }: { symbolName: string }) {
  const FormData = useSelector((state: RootState) => state.FormData);
  const watchList = useSelector((state: RootState) => state.watchList);
  const dispatch = useDispatch<AppDispatch>();
  const { setSymbolSelected } = useChart();

  const hiddendata = [
    {
      text_color: "text-white",
      bgcolor: "bg-primary/90",
      text: "Chart",
      icon: "📈",
      payload: {
        type: "update_rightHandSide" as const,
      },
    },
    {
      text_color: "text-white",
      bgcolor: "bg-destructive/90",
      text: "Delete",
      icon: "×",
      payload: { Type: "delete_watchListItem" as const },
    },
  ];
  const deleteApi = api.upadteAccountInfo.updateWatchList.useMutation({
    onSuccess: async (data) => {
      if (data) {
        dispatch(updateWatchList(data));
      }
    },
  });
  function deleteFunc(symbol: string) {
    symbol = symbol.toUpperCase();
    const list = watchList.List[watchList.ListNo];
    if (list) {
      const newList = list.filter((item) => item.toUpperCase() !== symbol.toUpperCase());
      console.log("delete api ->", symbol, list, newList);
      deleteApi.mutate({ name: newList.join(" "), row: watchList.ListNo });
    }
  }
  const updatePinApi = api.upadteAccountInfo.updatePins.useMutation({
    onSuccess: async (data) => {
      if (typeof data === "string") console.log(data);
      else dispatch(updateHeaderPin(data));
    },
  });

  const onClick = (payload: payloadT, text: string) => {
    console.log("clicked hidden elements payload ->", payload);
    if (payload) {
      if ("type" in payload) {
        if (payload.type === "update_FormData")
          dispatch(updateFormData({ ...FormData, isvisible: true, type: text === "B" ? "BUY" : "SELL", symbol: symbolName }));
        else if (payload.type === "update_rightHandSide") {
          setSymbolSelected(symbolName.toUpperCase());
        }
      } else if ("Type" in payload) {
        if (payload.Type === "Supdate_Pins") {
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
    }
  };
  return (
    <div className="flex gap-2">
      {hiddendata.map(({ payload, text_color, bgcolor, text, icon }) => {
        const className = twMerge(
          "flex items-center gap-2 px-3",
          "h-8 min-w-[32px]",
          "rounded-md",
          "transition-all duration-200",
          "cursor-pointer",
          "hover:scale-105 hover:shadow-md",
          "active:scale-95",
          "select-none",
          bgcolor,
          text_color,
        );

        return (
          <div className={className} key={"hiddenitems" + text} onClick={() => onClick(payload, text)} title={text}>
            <span className="text-lg font-bold">{icon}</span>
            <span className="hidden text-sm font-medium sm:inline-block">{text}</span>
          </div>
        );
      })}
    </div>
  );
}
