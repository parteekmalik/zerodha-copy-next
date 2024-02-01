import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import type { Tsymbol } from "./watchList";
import { parsePrice } from "../../utils";
import { Tdata } from "../../page";

export type Twsbinance = { method: "SUBSCRIBE"; params: string[]; id: number };

interface ISymbolInWL {
  list: Tsymbol[] | undefined;
  setData: Dispatch<SetStateAction<Tdata>>;
}
function SymbolInWL({ list, setData }: ISymbolInWL) {
  const { symbolLiveState, socketSend } = useContext(SymbolLiveContext);
  useEffect(() => {
    const msg: Twsbinance = {
      method: "SUBSCRIBE",
      params: [],
      id: 2,
    };
    list?.map((symbol) => {
      msg.params.push(symbol.name + "@ticker");
    });
    socketSend(JSON.stringify(msg));
  }, [list]);
  return (
    <div className="flex grow flex-col">
      {list
        ? list.map((symbol) => {
            const symbolName = symbol.name.toUpperCase();
            const symbolLiveTemp = symbolLiveState[symbolName] ?? {
              m: true,
              c: "0",
              p: "0",
              P: "0",
            };

            const price = parsePrice(symbolLiveTemp?.c);
            const diff = symbolLiveTemp.m ? 1 : -1;
            function BaseSymbolLayout() {
              return (
                <>
                  <div className="grow">{symbol.name.toUpperCase()}</div>
                  <div className="flex">
                    <div className="flex opacity-[.7]">
                      <div className="pr-[3px] text-black opacity-[.65] ">
                        {parsePrice(symbolLiveTemp?.p)}
                      </div>
                      <div className="flex   min-w-[45px]  text-right  text-black  ">
                        <div className="">
                          {parseFloat(symbolLiveTemp.P).toFixed(2)}
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
                      <a className="min-w-[60px] text-right">{price}</a>
                    </div>
                  </div>
                </>
              );
            }
            const hiddendata = [
              {
                bgcolor: "bg-[#4184f3]",
                text_color: "text-white",
                text: "B",
                clickHandle: () => {
                  console.log("dumy function ");
                },
              },
              {
                text_color: "text-white",
                bgcolor: "bg-[#ff5722]",

                text: "S",
                clickHandle: () => {
                  console.log("dumy function ");
                },
              },
              {
                text_color: "text-black",
                bgcolor: " bg-white",
                text: "d",
                clickHandle: () => {
                  console.log("dumy function ");
                },
              },
              {
                text_color: " text-black",
                bgcolor: " bg-white",
                text: "C",
                clickHandle: () => {
                  setData((prev) => {
                    return {
                      ...prev,
                      rightSideData: {
                        type: "chart",
                        symbol: symbolName,
                        TimeFrame: "5",
                      },
                    };
                  });
                },
              },
              {
                text_color: " text-black",
                bgcolor: " bg-white",
                text: "D",
                clickHandle: () => {
                  console.log("dumy function ");
                },
              },
              {
                text_color: " text-black",
                bgcolor: " bg-white",
                text: "O",
                clickHandle: () => {
                  console.log("dumy function ");
                },
              },
            ];
            function HiddenLayout(prop: {
              data: {
                bgcolor: string;
                text: string;
                text_color: string;
                clickHandle: () => void;
              }[];
            }) {
              return (
                <>
                  {prop.data.map(
                    ({ clickHandle, text_color, bgcolor, text }) => {
                      return (
                        <div
                          className={`h-full w-[35px] cursor-pointer rounded  p-[4px_10px] text-center hover:opacity-[.85] ${bgcolor} ${text_color}`}
                          key={"hiddenitems" + text}
                          onClick={clickHandle}
                        >
                          {text}
                        </div>
                      );
                    },
                  )}
                </>
              );
            }
            return (
              <div
                className={
                  "group/item relative flex border-b p-[12px_15px]  hover:bg-[#f9f9f9] " +
                  getColor(diff)
                }
                style={{ fontSize: ".8125rem" }}
                key={"symbol" + symbol.name}
              >
                <BaseSymbolLayout />
                <div className=" invisible absolute right-0 top-0 flex h-full gap-2 p-[8px_15px_8px_2px] text-white group-hover/item:visible">
                  <HiddenLayout data={hiddendata} />
                </div>
              </div>
            );
          })
        : null}
    </div>
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
