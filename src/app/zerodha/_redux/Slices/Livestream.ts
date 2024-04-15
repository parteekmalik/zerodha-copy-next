import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { TtickerChangeType } from "../storeComponent";
export type TsymbolTrade = { curPrice: string; symbol: string };
export type TsymbolLive = {
  symbol: string;
  curPrice: number;
  isup: boolean;
  prevPrice?: number;
  PriceChange?: string;
  PriceChangePercent?: string;
};
export type Tsymbol24hr = {
  symbol: string;
  prevPrice: string;
  curPrice: string;
};
export type TLivestreamType = {
  LiveData: Record<string, TsymbolLive>;
  subscriptions: string[];
};

const initialState: TLivestreamType = { LiveData: {}, subscriptions: [] };
const LivestreamSlice = createSlice({
  name: "LivestreamType",
  initialState,
  reducers: {
    updateLivestream: (state, action: PayloadAction<TsymbolTrade>) => {
      const payload = action.payload;
      const Livestream = state.LiveData;
      const isup = (curent: string, prev: number | undefined): boolean => {
        if (!prev) return true;
        return parseFloat(curent) >= prev;
      };
      let temp: TsymbolLive = {
        ...payload,
        curPrice: Number(payload.curPrice),
        isup: isup(payload.curPrice, Livestream[payload.symbol]?.curPrice),
      };
      const data = Livestream[payload.symbol];
      if (data?.prevPrice)
        temp = { ...temp, ...getChange(data.prevPrice, data.curPrice) };

      Livestream[payload.symbol] = temp;

      return state;
    },
    updateSubscription: (state, action: PayloadAction<string[]>) => {
      state.subscriptions = action.payload;
      return state;
    },
    update_Last24hrdata: (state, action: PayloadAction<Tsymbol24hr[]>) => {
      const LiveData = state.LiveData;

      action.payload.map((x) => {
        const data = LiveData[x.symbol];
        LiveData[x.symbol] = {
          ...(data ?? {
            symbol: x.symbol,
            isup: true,
            curPrice: Number(x.curPrice),
          }),
          ...getChange(Number(x.prevPrice), Number(x.curPrice)),
        };
      });
      return state;
    },
  },
});

export const { updateLivestream, updateSubscription, update_Last24hrdata } =
  LivestreamSlice.actions;

export default LivestreamSlice.reducer;

function getChange(prevPrice: number | string, curPrice: number | string) {
  const PriceChange = Number(Number(curPrice) - Number(prevPrice));
  const PriceChangePercent = Number(
    (Number(PriceChange) / Number(curPrice)) * 100,
  );
  return {
    prevPrice: Number(prevPrice),
    PriceChange: PriceChange.toFixed(getPointCount(curPrice)),
    PriceChangePercent: PriceChangePercent.toFixed(2),
  };
}
function getPointCount(price: string | number) {
  const RevStrprice = String(price).split("").reverse().join("");
  let i = RevStrprice.length - 1;
  for (; i > -1; i--) {
    if (RevStrprice[i] === ".") {
      break;
    }
  }
  return Math.max(i, 2);
}
