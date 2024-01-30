import { useContext, useEffect } from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import type { Tsymbol } from "./watchList";
import { parsePrice } from "../../utils";

export type Twsbinance = { method: "SUBSCRIBE"; params: string[]; id: number };

interface ISymbolInWL {
  list: Tsymbol[] | undefined;
}
function SymbolInWL({ list }: ISymbolInWL) {
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
  }, []);
  return (
    <div className="flex grow flex-col">
      {list
        ? list.map((symbol) => {
            const symbolName = symbol.name.toUpperCase();
            const price = parsePrice(symbolLiveState[symbolName]?.c);
            const diff = (
              symbolLiveState[symbolName]
                ? symbolLiveState[symbolName]?.m
                : 0
            )
              ? 1
              : -1;

            return (
              <div
                className={"flex border-b p-[15px]   " + getColor(diff)}
                style={{ fontSize: ".8125rem" }}
                key={"symbol" + symbol.name}
              >
                <div className="grow">{symbol.name.toUpperCase()}</div>
                <div className="flex">
                  <div className="flex opacity-[.7]">
                    <div className="pr-[3px] text-black opacity-[.65] ">
                      {parsePrice(symbolLiveState[symbolName]?.p)}
                    </div>
                    <div className="flex   min-w-[45px]  text-right  text-black  ">
                      <div className="">
                        {symbolLiveState[symbolName]?.P}
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
