import { ThunkMiddleware } from "@reduxjs/toolkit";
import { LiveStreanDataForMiddleware } from "../../_contexts/LiveData/BinanceWSContextComponent";
import { TFormDataType } from "../Slices/FormData";

const FormMddleware: ThunkMiddleware = (Store) => (next) => (action) => {
  let newAction = action as { type: string; payload: TFormDataType };

  if (newAction.type === "FormDataType/updateFormData") {
    newAction.payload.curPrice = Number(
      LiveStreanDataForMiddleware[newAction.payload.symbol]?.curPrice ?? 0,
    );
    newAction.payload.decimal = Number(
      LiveStreanDataForMiddleware[newAction.payload.symbol]?.decimal ?? 2,
    );
  }
  next(newAction);
};
export default FormMddleware;
