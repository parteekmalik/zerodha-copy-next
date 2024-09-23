import { ThunkMiddleware } from "@reduxjs/toolkit";
import axios from "axios";
import { Tsymbol24hr } from "../../_contexts/LiveData/BinanceWS";
import { websocketService } from "../../_contexts/LiveData/BinanceWSContextComponent";
import { RootState } from "../store";

const subsciptionsMddleware: ThunkMiddleware =
  (Store) => (next) => (action) => {
    next(action);
    const { type } = JSON.parse(JSON.stringify(action)) as { type: string };

    if (type === "BinanceWSStatsType/updateBinanceWSSubsriptions") {
      const newState = Store.getState() as RootState;
      if (newState.BinanceWSStats.subsciptions.length)
        getLast24hrData(newState.BinanceWSStats.subsciptions)
          .then((payload) => {
            websocketService.reducer({
              action: "update24hrData",
              payload,
            });
          })
          .catch((err) => console.log(err));
    }
  };
export default subsciptionsMddleware;
export const getLast24hrData = async (subscriptions: string[]) => {
  subscriptions = subscriptions.filter((i) => i !== "" && i !== " ");
  // console.log("subscriptions ->", subscriptions,subscriptions.filter((i) => i !== "" && i !== " "));
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
