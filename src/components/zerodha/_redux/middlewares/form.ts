import { type ThunkMiddleware } from "@reduxjs/toolkit";
import { LiveStreanDataForMiddleware } from "../../_contexts/LiveData/BinanceWSContextComponent";
import { type TFormDataType } from "../Slices/FormData";

const FormMddleware: ThunkMiddleware = () => (next) => (action) => {
  const newAction = action as { type: string; payload: TFormDataType };

  if (newAction.type === "FormDataType/updateFormData") {
    newAction.payload.curPrice = Number(LiveStreanDataForMiddleware[newAction.payload.symbol]?.curPrice ?? 0);
    newAction.payload.decimal = Number(LiveStreanDataForMiddleware[newAction.payload.symbol]?.decimal ?? 2);
  }
  next(newAction);
};
export default FormMddleware;
