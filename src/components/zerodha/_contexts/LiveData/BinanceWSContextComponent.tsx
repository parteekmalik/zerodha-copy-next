"use client";
import type { PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import {
  BackndWSContextProvider,
  type TLivestreamType,
  type Tsymbol24hr,
  type TsymbolLive,
  type TsymbolTrade,
} from "./BinanceWS";
import { modifyNumber } from "~/app/kite/utils";

const initialState: TLivestreamType = {};
function getChange(prevPrice: number | string, curPrice: number | string) {
  const PriceChange = Number(Number(curPrice) - Number(prevPrice));
  const PriceChangePercent = Number((Number(PriceChange) / Number(curPrice)) * 100);
  return {
    prevPrice: Number(prevPrice),
    PriceChange: modifyNumber(PriceChange, getPointCount(curPrice), true),
    PriceChangePercent: modifyNumber(PriceChangePercent, 2, true),
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
const BinanceWSContextComponent: React.FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props;

  const [LiveStreanData, setLiveStreanData] = useState(initialState);

  useEffect(() => {
    websocketService.updateDatafunction(setLiveStreanData);
  }, []);
  useEffect(() => {
    LiveStreanDataForMiddleware = LiveStreanData;
  }, [LiveStreanData]);

  return (
    <BackndWSContextProvider
      value={{
        LiveStreanData,
      }}
    >
      {children}
    </BackndWSContextProvider>
  );
};
export default BinanceWSContextComponent;
export let LiveStreanDataForMiddleware: TLivestreamType = {};
export type actionBinanceData =
  | { action: "updateData"; payload: TsymbolTrade }
  | { action: "update24hrData"; payload: Tsymbol24hr[] }
  | {
      action: "comparePrice";
      payload: { price: string | number; name: string };
    };

type updateDatafunctionType = React.Dispatch<React.SetStateAction<TLivestreamType>>;

let updateDatafunction: updateDatafunctionType;

export const websocketService = {
  // Register updateDatafunction
  updateDatafunction: (fn: updateDatafunctionType) => {
    updateDatafunction = fn;
  },
  // Handle action dispatching
  reducer: (data: actionBinanceData) => {
    switch (data.action) {
      case "updateData": {
        const payload = data.payload;
        updateDatafunction((Livestream) => {
          const data = Livestream[payload.symbol];
          const price = Number(payload.curPrice);
          const decimal = Math.max(data?.decimal ?? 0, countDecimalPoints(price));
          const diff = Number(payload.curPrice) - Number(Livestream[payload.symbol]?.curPrice);
          let temp: TsymbolLive = {
            ...payload,
            curPrice: price.toFixed(decimal),
            decimal,
            isup: diff > 0 ? "up" : diff === 0 ? data?.isup ?? "same" : "down",
          };
          if (data?.prevPrice) temp = { ...temp, ...getChange(data.prevPrice, data.curPrice) };

          Livestream[payload.symbol] = temp;
          return { ...Livestream };
        });
        break;
      }
      case "update24hrData": {
        console.log("update24hrData: ", data.payload);
        updateDatafunction((LiveData) => {
          data.payload.forEach((x) => {
            const data = LiveData[x.symbol] ?? {
              symbol: x.symbol,
              decimal: 0,
              isup: "up",
              curPrice: x.curPrice,
            };
            LiveData[x.symbol] = {
              ...data,
              ...getChange(Number(x.prevPrice), Number(x.curPrice)),
            };
          });
          return { ...LiveData };
        });
        break;
      }
      case "comparePrice": {
        const curPrice = Number(LiveStreanDataForMiddleware[data.payload.name]?.curPrice);
        const givenPrice = Number(data.payload.price);
        return curPrice <= givenPrice ? "STOP" : curPrice === givenPrice ? "MARKET" : "LIMIT";
      }
      default: {
        console.log("default statement run in binanceData", data);
      }
    }
  },
};
