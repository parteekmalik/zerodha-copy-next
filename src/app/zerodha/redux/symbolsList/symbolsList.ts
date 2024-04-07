import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { JSONType, symbolList } from "public/symbolname";
import { listToRecord } from "../../utils";
type TtickerChangeType = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};
export type TsymbolsListType = Record<string, JSONType>;

const initialState: TsymbolsListType = {};
const symbolsListSlice = createSlice({
  name: "symbolsListType",
  initialState,
  reducers: {
    updateSymbolsList: (state, action: PayloadAction<JSONType[]>) => {
      console.log(action);
      const symbolsList = listToRecord(action.payload, "symbol");
      return symbolsList;
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(incrementAsync.pending, () => {
  //         console.log("incrementAsync.pending");
  //       })
  //       .addCase(
  //         incrementAsync.fulfilled,
  //         (state, action: PayloadAction<number>) => {
  //           state.value += action.payload;
  //         },
  //       );
  //   },
});
// export const incrementAsync = createAsyncThunk(
//   "counter/incrementAsync",
//   async (subscriptions: string[]) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return amount;
//   },
// );
export const { updateSymbolsList } = symbolsListSlice.actions;

export default symbolsListSlice.reducer;
