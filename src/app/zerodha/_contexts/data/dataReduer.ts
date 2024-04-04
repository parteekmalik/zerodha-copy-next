import { Orders } from "@prisma/client";
import type {
  IdataContextState,
  TFormtatur,
  TPin,
  TrightSideType,
  TuserDetails,
} from "./data";
import { api } from "~/trpc/react";

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
      type: "update_Orders";
      payload: Orders[];
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
    case "update_Orders": {
      return { ...state, orders: payload };
    }
    default:
      return state;
  }
};
