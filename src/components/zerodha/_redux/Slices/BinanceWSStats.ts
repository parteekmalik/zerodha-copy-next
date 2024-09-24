import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TBinanceWSStatsType = {
  isConnected: boolean;
  subsciptions: string[];
  seprateSubscriptions: Record<string, string[]>;
};

const initialState: TBinanceWSStatsType = {
  isConnected: false,
  subsciptions: [],
  seprateSubscriptions: {},
};
const BinanceWSStatsSlice = createSlice({
  name: "BinanceWSStatsType",
  initialState,
  reducers: {
    updateBinanceWSStats: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateBinanceWSSubsriptions: (state, action: PayloadAction<string[]>) => {
      state.subsciptions = action.payload;
    },
    updateSeprateSubscriptions: (state, action: PayloadAction<{ name: string; subsription: string[] }>) => {
      state.seprateSubscriptions[action.payload.name] = action.payload.subsription;
      return state;
    },
  },
});

export const { updateBinanceWSStats, updateBinanceWSSubsriptions, updateSeprateSubscriptions } =
  BinanceWSStatsSlice.actions;

export default BinanceWSStatsSlice.reducer;
