import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type TrightSideType = {
  type:
    | "chart"
    | "Dashboard"
    | "Orders"
    | "Holdings"
    | "Positions"
    | "Bids"
    | "Funds";
  symbol?: string;
  TimeFrame?: string;
};

const initialState: TrightSideType = { type: "Dashboard" };

const rightSideSlice = createSlice({
  name: "rightSideType",
  initialState,
  reducers: {
    updateRightSide: (state, action: PayloadAction<TrightSideType>) => {
      return action.payload;
    },
  },
});

export const { updateRightSide } = rightSideSlice.actions;

export default rightSideSlice.reducer;
