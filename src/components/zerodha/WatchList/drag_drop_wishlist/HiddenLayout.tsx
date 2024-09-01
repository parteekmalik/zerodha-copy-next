import { useDispatch, useSelector } from "react-redux";

import {
  TFormDataType,
  updateFormData,
} from "~/components/zerodha/_redux/Slices/FormData";
import { updateHeaderPin } from "~/components/zerodha/_redux/Slices/headerPin";

import Link from "next/link";
import { updateWatchList } from "~/components/zerodha/_redux/Slices/watchList";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { TsymbolLive } from "../../_redux/Slices/Livestream";
type IdataContextActions =
  | {
      type: "update_rightHandSide";
      payload: {
        type: string;
        symbol: string;
        TimeFrame: string;
      };
    }
  | {
      type: "update_watchList";
      payload: string[][];
    }
  | {
      type: "update_FormData";
      payload: TFormDataType;
    };
export function BaseSymbolLayout({
  symbolName,
  symbolLiveTemp,
}: {
  symbolName: string;
  symbolLiveTemp: TsymbolLive | undefined;
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

            <span className="my-auto text-[.652rem]  ">
              {symbolLiveTemp && "%"}
            </span>
          </div>
        </div>
        <div className="flex ">
          {symbolLiveTemp && (
            <a
              className={
                ` px-2 font-semibold    ` +
                (diff > 0
                  ? "rotate-90 after:content-['<']"
                  : "rotate-90 after:content-['>']")
              }
            ></a>
          )}
          <a className="min-w-[60px] text-right">{symbolLiveTemp?.curPrice}</a>
        </div>
      </div>
    </>
  );
}
export function HiddenLayout({ symbolName }: { symbolName: string }) {
  const FormData = useSelector((state: RootState) => state.FormData);
  const watchList = useSelector((state: RootState) => state.watchList);
  const dispatch = useDispatch<AppDispatch>();

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
      bgcolor: "bg-blueApp",
      text_color: "text-white",
      text: "B",
      payload: {
        type: "update_FormData",
        payload: {
          ...FormData,
          isvisible: true,
          type: "BUY",
          symbol: symbolName,
        },
      },
    },
    {
      text_color: "text-white",
      bgcolor: "bg-orangeApp",

      text: "S",
      payload: {
        type: "update_FormData",
        payload: {
          ...FormData,
          isvisible: true,
          type: "SELL",
          symbol: symbolName,
        },
      },
    },
    {
      text_color: " text-black",
      bgcolor: " bg-white",
      text: "C",
      payload: {
        type: "update_rightHandSide",
        payload: {
          type: "Chart",
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
      const newList = list.filter(
        (item) => item.toUpperCase() !== symbol.toUpperCase(),
      );
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
  return (
    <>
      {hiddendata.map(({ payload, text_color, bgcolor, text }) => {
        const className =
          `h-full w-[35px] cursor-pointer rounded   p-[4px_10px] text-center hover:opacity-[.95]  ${bgcolor} ${text_color} ` +
          (text !== "B" && text !== "S"
            ? " border border-black hover:bg-gray-400 hover:text-white"
            : " border border-white  ");
        const onClick = () => {
          console.log("clicked hidden elements payload ->", payload);
          if (payload) {
            if ("type" in payload) {
              if (payload.type === "update_FormData")
                dispatch(updateFormData(payload.payload));
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
        if (
          payload &&
          "type" in payload &&
          payload.type === "update_rightHandSide"
        ) {
          return (
            <Link
              href={`Chart?symbol=${payload.payload.symbol.toUpperCase()}&TimeFrame=${
                payload.payload.TimeFrame
              }`}
              key={"hiddenitems" + text}
              className={className}
            >
              {text}
            </Link>
          );
        } else
          return (
            <div
              className={className}
              key={"hiddenitems" + text}
              onClick={onClick}
            >
              {text}
            </div>
          );
      })}
    </>
  );
}
