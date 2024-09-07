import type { PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import {
  BackndWSContextProvider,
  TLivestreamType,
  Tsymbol24hr,
  TsymbolLive,
  TsymbolTrade,
} from "./BinanceWS";
import { modifyNumber } from "~/app/utils";

const initialState: TLivestreamType = {};
function getChange(prevPrice: number | string, curPrice: number | string) {
  const PriceChange = Number(Number(curPrice) - Number(prevPrice));
  const PriceChangePercent = Number(
    (Number(PriceChange) / Number(curPrice)) * 100,
  );
  return {
    prevPrice: Number(prevPrice),
    PriceChange: modifyNumber(PriceChange, getPointCount(curPrice),true),
    PriceChangePercent: modifyNumber(PriceChangePercent, 2,true),
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
const BinanceWSContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;
  const [binanceServerConnection, setbinanceServerConnection] = useState<
    "connected" | "disconneted"
  >("disconneted");

  const [LiveStreanData, setLiveStreanData] = useState(initialState);

  useEffect(() => {
    websocketService.updateStatusfunction(setbinanceServerConnection);
    websocketService.updateDatafunction(setLiveStreanData);
  }, []);

  return (
    <BackndWSContextProvider
      value={{
        LiveStreanData,
        binanceServerConnection,
      }}
    >
      {children}
    </BackndWSContextProvider>
  );
};
export default BinanceWSContextComponent;

export type actionBinanceData =
  | { action: "updateData"; payload: TsymbolTrade }
  | { action: "updateStatus"; payload: "connected" | "disconneted" }
  | { action: "update24hrData"; payload: Tsymbol24hr[] };

type updateDatafunctionType = React.Dispatch<
  React.SetStateAction<TLivestreamType>
>;
type updateStatusfunctionType = React.Dispatch<
  React.SetStateAction<"connected" | "disconneted">
>;

let updateDatafunction: updateDatafunctionType;
let updateStatusfunction: updateStatusfunctionType;

export const websocketService = {
  // Register updateDatafunction
  updateDatafunction: (fn: updateDatafunctionType) => {
    updateDatafunction = fn;
  },
  // Register updateStatusfunction
  updateStatusfunction: (fn: updateStatusfunctionType) => {
    updateStatusfunction = fn;
  },
  // Handle action dispatching
  reducer: (data: actionBinanceData) => {
    switch (data.action) {
      case "updateData": {
        const payload = data.payload;
        updateDatafunction((Livestream) => {
          const isup = (curent: string, prev: number | undefined): boolean => {
            if (!prev) return true;
            return parseFloat(curent) >= prev;
          };
          const data = Livestream[payload.symbol];
          const price = Number(payload.curPrice);
          const decimal = Math.max(
            data?.decimal ?? 0,
            countDecimalPoints(price),
          );
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

          return { ...Livestream };
        });
        break;
      }
      case "updateStatus": {
        updateStatusfunction(data.payload);
        break;
      }
      case "update24hrData": {
        console.log("update24hrData: ", data.payload);
        updateDatafunction((LiveData) => {
          data.payload.forEach((x) => {
            const data = LiveData[x.symbol] ?? {
              symbol: x.symbol,
              decimal: 0,
              isup: true,
              curPrice: x.curPrice,
            };
            const price = Number(x.curPrice);
            const decimal = Math.max(
              data?.decimal ?? 0,
              countDecimalPoints(price),
            );
            LiveData[x.symbol] = {
              ...data,
              ...getChange(Number(x.prevPrice), Number(x.curPrice)),
            };
          });
          return { ...LiveData };
        });
        break;
      }
      default: {
        console.log("default statement run in binanceData", data);
      }
    }
  },
};
