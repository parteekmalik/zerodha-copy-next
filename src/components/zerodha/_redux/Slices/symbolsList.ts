import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { JSONType } from "public/symbolNameType";
import { listToRecord } from "../../../../app/utils";
type TtickerChangeType = {
  quoteAsset: string;
  status: string;
  symbol: string;
  baseAsset: string;
  name: string;
};

export type TsymbolsListType = Record<string, TtickerChangeType>;

const initialState: TsymbolsListType = {};
const symbolsListSlice = createSlice({
  name: "symbolsListType",
  initialState,
  reducers: {
    updateSymbolsList: (state, action: PayloadAction<JSONType[]>) => {
      const symbolsList = listToRecord(
        action.payload
          .map((item) => {
            return {
              quoteAsset: item.quoteAsset,
              status: item.status,
              symbol: item.symbol,
              baseAsset: item.baseAsset,
              name: item.name,
            };
          })
          .filter((i) => i.status === "TRADING"),
        "symbol",
      );
      return symbolsList;
    },
  },
});
export const { updateSymbolsList } = symbolsListSlice.actions;

export default symbolsListSlice.reducer;
