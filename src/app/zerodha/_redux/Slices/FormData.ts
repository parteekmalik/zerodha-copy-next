import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type TFormDataType = {
  isvisible: boolean;
  symbol: string;
  type: "BUY" | "SELL";
};

const initialState: TFormDataType = {
  isvisible: false,
  symbol: "BTCUSDT",
  type: "BUY",
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
