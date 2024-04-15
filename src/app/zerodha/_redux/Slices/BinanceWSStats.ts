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
      return state;
    },
    updateBinanceWSSubsriptions: (state, action: PayloadAction<string[]>) => {
      state.subsciptions = action.payload;
      return state;
    },
  },
});

export const { updateBinanceWSStats } = BinanceWSStatsSlice.actions;

export default BinanceWSStatsSlice.reducer;
