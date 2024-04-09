import TsMap from "ts-map";
import { TOrderCalculations } from "./OrderCalculations";
import { TLivestreamType } from "~/app/zerodha/_redux/Livestream/Livestream";

export const closed_open_OrdersData = (
  list: TsMap<string, TOrderCalculations>,
  Livestream: TLivestreamType,
) => {
  return list.keys().map((key, i) => {
    const value = list.get(key);
    let data: {
      Product: string;
      Instrument: string;
      Quantity: number;
      AVG: number;
      LTP: number;
      "P&L": string;
      change: string;
    } = {
      Product: "SPOT",
      Instrument: key,
      Quantity: 0,
      AVG: 0,
      LTP: 0,
      "P&L": "0",
      change: "0",
    };
    if (value) {
      const QUANTITY = value.BuyQuantity - value.SellQuantity;
      const AVG = QUANTITY === 0 ? 0 : value.BuyPriceTotal / value.BuyQuantity;
      const CURPRICE = Livestream[key]?.curPrice ?? 0;
      const PROFIT =
        (QUANTITY !== 0 ? QUANTITY * CURPRICE : 0) +
        value.SellPriceTotal -
        value.BuyPriceTotal;

      const CHANGE =
        QUANTITY === 0
          ? "0.00%"
          : ((PROFIT * 100) / value.BuyPriceTotal).toFixed(2) + "%";

      data = {
        ...data,
        Quantity: QUANTITY,
        AVG: AVG,
        LTP: CURPRICE,
        "P&L": PROFIT.toFixed(2),
        change: CHANGE,
      };
    }
    return {
      id: "" + i,
      data,
    };
  });
};
