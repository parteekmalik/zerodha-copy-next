import { JSONType } from "../../symbolname";
import type { IsymbolLiveContextState, Tlast24hr } from "./SymbolLive";

export type IsymbolLiveContextActions =
  | {
      type: "update_symbol";
      payload: Tlast24hr;
    }
  | {
      type: "update_symbolList";
      payload: JSONType[];
    }
  | {
      type: "update_subsciptionList";
      payload: string[];
    }
  | {
      type: "update_last_symbol";
      payload: Tlast24hr;
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
      const isup = (curent: string, prev: string | undefined): boolean => {
        if (!prev) return true;
        return parseFloat(curent) >= parseFloat(prev);
      };

      Livestream[payload.s] = {
        ...payload,
        m: isup(payload.c, Livestream[payload.s]?.c),
      };
      return { ...state, Livestream };
    }
    case "update_symbolList": {
      const symbolsList = { ...state.symbolsList };
      payload.map((x) => {
        symbolsList[x.symbol] = x;
      });

      return { ...state, symbolsList };
    }
    case "update_subsciptionList": {
      return { ...state, subscriptions: payload };
    }
    default:
      return state;
  }
};
