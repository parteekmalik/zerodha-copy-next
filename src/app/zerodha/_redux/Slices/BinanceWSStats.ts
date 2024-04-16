import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TBinanceWSStatsType = {
  isConnected: boolean;
  subsciptions: string[];
};

const initialState: TBinanceWSStatsType = {
  isConnected: false,
  subsciptions: [],
};
const BinanceWSStatsSlice = createSlice({
  name: "BinanceWSStatsType",
  initialState,
  reducers: {
    updateBinanceWSStats: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateBinanceWSSubsriptions: (state, action: PayloadAction<string[]>) => {
      console.log(action);
      state.subsciptions = action.payload;
    },
  },
});

export const { updateBinanceWSStats, updateBinanceWSSubsriptions } =
  BinanceWSStatsSlice.actions;

export default BinanceWSStatsSlice.reducer;
