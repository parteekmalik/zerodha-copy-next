import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Trades } from "@prisma/client";

export type TordersType = Trades[][];

const initialState: TordersType = [];
const ordersSlice = createSlice({
  name: "ordersType",
  initialState,
  reducers: {
    updateOrders: (state, action: PayloadAction<TordersType>) => {
      return action.payload;
    },
  },
});

export const { updateOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
