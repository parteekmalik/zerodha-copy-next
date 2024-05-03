// math.test.ts

import { parsePrice } from "../app/zerodha/utils";
// const sample: TcalculateTradesSummaryFIFO[] = [
//   {
//     type: "BUY",
//     price: 100,
//     quantity: 5,
//   },
//   {
//     type: "BUY",
//     price: 200,
//     quantity: 10,
//   },
// ];
// const sample1: TcalculateTradesSummaryFIFO[] = [
//   {
//     type: "BUY",
//     price: 100,
//     quantity: 5,
//   },
//   {
//     type: "BUY",
//     price: 200,
//     quantity: 10,
//   },
//   {
//     type: "SELL",
//     price: 200,
//     quantity: 12,
//   },
// ];
// const sample2: TOrder[] = [
//   {
//     id: "sdasda",
//     createdAt: moment().toDate(),
//     name: "BTCUSDT",
//     type: "BUY",
//     price: 100,
//     quantity: 5,
//     status: "completed",
//     triggerType: "MARKET",
//     sl: 0,
//     tp: 0,
//     TradingAccountId: "sds",
//   },
//   {
//     id: "sdasda",
//     createdAt: moment().toDate(),
//     name: "BTCUSDT",
//     type: "BUY",
//     price: 200,
//     quantity: 10,
//     status: "completed",
//     triggerType: "MARKET",
//     sl: 0,
//     tp: 0,
//     TradingAccountId: "sds",
//   },
//   {
//     id: "sdasda",
//     createdAt: moment().toDate(),
//     name: "BTCUSDT",
//     type: "SELL",
//     price: 200,
//     quantity: 12,
//     status: "completed",
//     triggerType: "MARKET",
//     sl: 0,
//     tp: 0,
//     TradingAccountId: "sds",
//   },
// ];

describe("Math functions", () => {
  test("parsePrice passed", () => {
    expect(parsePrice("0.01234")).toBe(0.01234);
    expect(parsePrice("0.45800000")).toBe(0.458);
    expect(parsePrice("0.00054000")).toBe(0.00054);
  });
});

// describe("cal p&l", () => {
//   test("p&l passed", () => {
//     const result = Total_avg_Price(sample);
//     const expected = { avg: 166.67, total: 2500 };
//     expect(result).toEqual(expected);
//   });
// });
// describe("cal p&l", () => {
//   test("p&l passed", () => {
//     const result = calculateTradesSummaryFIFO(sample1, 300);
//     const expected = {
//       avgPrice: 166.67,
//       netQuantity: 3,
//       profitOrLoss: 800,
//     };
//     expect(result).toEqual(expected);
//   });
// });
// describe("cal p&l", () => {
//   test("p&l passed", () => {
//     const result = new OrdersManage(sample2).dummy;

//     const expected = "dummy";
//     expect(result).toEqual(expected);
//   });
// });
