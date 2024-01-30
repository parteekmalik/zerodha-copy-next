import type {
  IsymbolLiveContextState,
  Tlast24hr
} from "./SymbolLive";

export type IsymbolLiveContextActions =
  | {
      type: "update_symbol";
      payload: Tlast24hr;
    }
  | {
      type: "update_last_symbol";
      payload: Tlast24hr;
    };

const excludeType = ["update_symbol"];
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
      const updatesState = { ...state };
      const isup = (curent: string, prev: string | undefined): boolean => {
        if (!prev) return true;
        return parseFloat(curent) >= parseFloat(prev);
      };

      updatesState[payload.s] = {
        ...payload,
        m: isup(payload.c, updatesState[payload.s]?.c),
      };
      return updatesState;
    }
    default:
      return state;
  }
};
