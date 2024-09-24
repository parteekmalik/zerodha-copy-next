import { Order } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TFormDataType = {
  isvisible: boolean;
  symbol: string;
  type: "BUY" | "SELL";
  curPrice: number;
  decimal: number;
  editOrder: undefined | Order;
};

const initialState: TFormDataType = {
  isvisible: false,
  symbol: "BTCUSDT",
  type: "BUY",
  curPrice: 0,
  decimal: 2,
  editOrder: undefined,
};

const FormDataSlice = createSlice({
  name: "FormDataType",
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<TFormDataType>) => {
      console.log(action);
      return action.payload;
    },
  },
});

export const { updateFormData } = FormDataSlice.actions;

export default FormDataSlice.reducer;
