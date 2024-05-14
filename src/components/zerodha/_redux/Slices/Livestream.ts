import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type TsymbolTrade = { curPrice: string; symbol: string };
export type TsymbolLive = {
  symbol: string;
  curPrice: string;
  isup: boolean;
  decimal: number;
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

export const update_Last24hrdata = createAsyncThunk(
  "LivestreamType/update_Last24hrdata",
  async (subscriptions: string[], thunkApi) => {
    const response = await getLast24hrData(subscriptions);
    return response;
  },
);

const LivestreamSlice = createSlice({
  name: "LivestreamType",
  initialState,
  reducers: {
    updateLivestream: (state, action: PayloadAction<TsymbolTrade>) => {
      const payload = action.payload;
      const Livestream = state;
      const isup = (curent: string, prev: number | undefined): boolean => {
        if (!prev) return true;
        return parseFloat(curent) >= prev;
      };
      const data = Livestream[payload.symbol];
      const price = Number(payload.curPrice);
      const decimal = Math.max(data?.decimal ?? 0, countDecimalPoints(price));
      let temp: TsymbolLive = {
        ...payload,
        curPrice: price.toFixed(decimal),
        decimal,
        isup: isup(
          payload.curPrice,
          Number(Livestream[payload.symbol]?.curPrice),
        ),
      };
      if (data?.prevPrice)
        temp = { ...temp, ...getChange(data.prevPrice, data.curPrice) };

      Livestream[payload.symbol] = temp;

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(update_Last24hrdata.fulfilled, (state, action) => {
      const LiveData = state;

      action.payload.forEach((x: Tsymbol24hr) => {
        const data = LiveData[x.symbol];
        const price = Number(x.curPrice);
        const decimal = Math.max(data?.decimal ?? 0, countDecimalPoints(price));
        LiveData[x.symbol] = {
          ...(data ?? {
            symbol: x.symbol,
            isup: true,
            decimal,
            curPrice: price.toFixed(decimal),
          }),
          ...getChange(Number(x.prevPrice), Number(x.curPrice)),
        };
      });
    });
  },
});

export const { updateLivestream } = LivestreamSlice.actions;

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
export type TtickerChangeType = {
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
export const getLast24hrData = async (subscriptions: string[]) => {
  // console.log("subscriptions", subscriptions);
  subscriptions = subscriptions.filter((i) => i !== "");
  if (subscriptions.length === 0) return [] as Tsymbol24hr[];
  const url = "https://api.binance.com/api/v3/ticker/24hr?symbols=";
  const subSymbol = JSON.stringify(
    subscriptions.map((item) => item.split("@")[0]?.toUpperCase()),
  );
  // console.log("url", url);
  return await axios
    .get(url + subSymbol)
    .then((data: { data: TtickerChangeType[] }) => {
      // console.log("TtickerChangeType -> ", data.data);
      const last24hrData: Tsymbol24hr[] = data.data.map((item) => {
        return {
          symbol: item.symbol,
          prevPrice: item.openPrice,
          curPrice: item.lastPrice,
        };
      });
      return last24hrData;
    })
    .catch((error) => {
      console.log(error);
      return [] as Tsymbol24hr[];
    });
};
function countDecimalPoints(number: number) {
  // Convert the number to a string
  const numberString = number.toString();

  // Find the position of the decimal point
  const decimalIndex = numberString.indexOf(".");

  // If there's no decimal point, return 0
  if (decimalIndex === -1) {
    return 0;
  }

  // Calculate the count of decimal points
  const decimalCount = numberString.length - decimalIndex - 1;

  return decimalCount;
}
