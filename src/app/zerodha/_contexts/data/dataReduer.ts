import type { TorderForm } from "../../_components/OrderForm/orderForm";
import type { IdataContextState, TFormtatur, TPin, TuserDetails } from "./data";
import type { TrightSideType } from "./data";

export type IdataContextActions =
  | {
      type: "update_rightHandSide";
      payload: TrightSideType;
    }
  | {
      type: "update_watchList";
      payload: string[][];
    }
  | {
      type: "update_userDetails";
      payload: TuserDetails;
    }
  | {
      type: "update_Pins";
      payload: TPin;
    }
  | {
      type: "update_FormData";
      payload: TFormtatur;
    };

const excludeType = ["update_symbol"];
export const dataReducer = (
  state: IdataContextState,
  action: IdataContextActions,
) => {
  const { type: Atype, payload } = action;
  if (!excludeType.includes(Atype)) {
    // console.log(
    //   "Update State - Action: " + action.type + " - Payload: ",
    //   action.payload,
    // );
  }
  switch (Atype) {
    case "update_rightHandSide": {
      return { ...state, rightSideData: payload };
    }
    case "update_FormData": {
      return { ...state, FormData: payload };
    }
    case "update_watchList": {
      return { ...state, watchList: payload };
    }
    case "update_userDetails": {
      return { ...state, userDetails: payload };
    }
    case "update_Pins": {
      return { ...state, headerPin: payload };
    }
    default:
      return state;
  }
};
