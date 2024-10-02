import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TheaderPinType = { Pin0: string; Pin1: string };

const initialState: TheaderPinType = { Pin0: "", Pin1: "" };
const headerPinSlice = createSlice({
  name: "headerPinType",
  initialState,
  reducers: {
    updateHeaderPin: (state, action: PayloadAction<TheaderPinType>) => {
      return action.payload;
    },
  },
});

export const { updateHeaderPin } = headerPinSlice.actions;

export default headerPinSlice.reducer;
