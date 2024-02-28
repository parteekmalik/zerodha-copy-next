import type { JSONType } from "../../symbolname";
import type { IsymbolLiveContextState, TsymbolLive } from "./SymbolLive";

export type IsymbolLiveContextActions =
  | {
      type: "update_symbol";
      payload: { curPrice: string; symbol: string };
    }
  | {
      type: "update_symbolList";
      payload: JSONType[];
    }
  | {
      type: "update_last24hrdata";
      payload: { symbol: string; prevPrice: string; curPrice: string }[];
    };

const excludeType = ["update_symbol", "update_symbolList"];
export const symbolLiveReducer = (
  state: IsymbolLiveContextState,
  action: IsymbolLiveContextActions,
) => {
  const { type: Atype, payload } = action;
  if (!excludeType.includes(Atype)) {
    console.log(
      "Update State - Action: " + action.type + " - Payload: ",
      action.payload,
    );
  }
  switch (Atype) {
    case "update_symbol": {
      const Livestream = { ...state.Livestream };
      const isup = (curent: string, prev: number | undefined): boolean => {
        if (!prev) return true;
        return parseFloat(curent) >= prev;
      };
      let temp: TsymbolLive = {
        ...payload,
        curPrice: Number(payload.curPrice),
        isup: isup(payload.curPrice, Livestream[payload.symbol]?.curPrice),
      };
      const data = Livestream[payload.symbol];
      if (data?.prevPrice)
        temp = { ...temp, ...getChange(data.prevPrice, data.curPrice) };

      Livestream[payload.symbol] = temp;
      return { ...state, Livestream };
    }
    case "update_symbolList": {
      const symbolsList = { ...state.symbolsList };
      payload.map((x) => {
        symbolsList[x.symbol] = x;
      });

      return { ...state, symbolsList };
    }
    case "update_last24hrdata": {
      const Livestream = { ...state.Livestream };
      payload.map((x) => {
        const data = Livestream[x.symbol];
        console.log("reducer last24hr ->", {
          ...data,
          ...getChange(Number(x.prevPrice), Number(x.curPrice)),
        });
        Livestream[x.symbol] = {
          ...(data ?? {
            symbol: x.symbol,
            isup: true,
            curPrice: Number(x.curPrice),
          }),
          ...getChange(Number(x.prevPrice), Number(x.curPrice)),
        };
      });

      return { ...state, Livestream };
    }
    default:
      return state;
  }
};
function getChange(prevPrice: number | string, curPrice: number | string) {
  const PriceChange = Number(Number(curPrice) - Number(prevPrice));
  const PriceChangePercent = Number(
    (Number(PriceChange) / Number(curPrice)) * 100,
  );
  return {
    prevPrice: Number(prevPrice),
    PriceChange: PriceChange.toFixed(2),
    PriceChangePercent: PriceChangePercent.toFixed(2),
  };
}
