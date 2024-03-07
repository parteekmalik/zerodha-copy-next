// math.test.ts

import moment from "moment";
import {
  parsePrice,
  calculateTradesSummaryFIFO,
  TcalculateTradesSummaryFIFO,
} from "../app/zerodha/utils";
import { $Enums } from "@prisma/client";
import { TOrder } from "../app/zerodha/_components/Rightside/Order";
const sample: TcalculateTradesSummaryFIFO[] = [
  {
    type: "BUY",
    price: 100,
    quantity: 5,
  },
  {
    type: "BUY",
    price: 200,
    quantity: 10,
  },
  {
    type: "SELL",
    price: 300,
    quantity: 5,
  },
];
describe("Math functions", () => {
  test("parsePrice passed", () => {
    expect(parsePrice("0.01234")).toBe(0.01234);
    expect(parsePrice("0.45800000")).toBe(0.458);
    expect(parsePrice("0.00054000")).toBe(0.00054);
  });
});
describe("cal p&l", () => {
  test("p&l passed", () => {
    const result = calculateTradesSummaryFIFO(sample, 400);
    const expected = {
      avgPrice: 200,
      netQuantity: 10,
      profitOrLoss: 1000,
    };
    expect(result).toEqual(expected);
  });
});
