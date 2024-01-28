import { IsymbolLiveContextState, TsymbolTrade } from "./SymbolLive";

export type IsymbolLiveContextActions = {
  type: "update_symbol";
  payload: TsymbolTrade;
};

export const symbolLiveReducer = (
  state: IsymbolLiveContextState,
  action: IsymbolLiveContextActions,
) => {
  console.log(
    "Update State - Action: " + action.type + " - Payload: ",
    action.payload,
  );
  const { type: Atype, payload } = action;
  switch (action.type) {
    case "update_symbol": {
      const updatesState = { ...state };
      updatesState[payload.s] = payload;
      return updatesState;
    }
    default:
      return state;
  }
};
