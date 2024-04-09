import { PayloadAction, createSlice } from "@reduxjs/toolkit";
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
export type TLivestreamType = Record<string, TsymbolLive>;

const initialState: TLivestreamType = {};
const LivestreamSlice = createSlice({
  name: "LivestreamType",
  initialState,
  reducers: {
    updateLivestream: (state, action: PayloadAction<TsymbolTrade>) => {
      console.log(action);
      const payload = action.payload;
      const Livestream = { ...state };
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
      return { ...Livestream };
      // return action.payload;
    },
    update_last24hrdata: (state, action: PayloadAction<Tsymbol24hr[]>) => {
      const Livestream = state;
      action.payload.map((x) => {
        const data = Livestream[x.symbol];
        Livestream[x.symbol] = {
          ...(data ?? {
            symbol: x.symbol,
            isup: true,
            curPrice: Number(x.curPrice),
          }),
          ...getChange(Number(x.prevPrice), Number(x.curPrice)),
        };
        return Livestream;
      });
    },
  },
});

export const { updateLivestream,update_last24hrdata } = LivestreamSlice.actions;

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
