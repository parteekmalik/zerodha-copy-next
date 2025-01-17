import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type Order } from "@prisma/client";

export type TordersType = Order[][];

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
