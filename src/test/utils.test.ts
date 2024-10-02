// math.test.ts

import { type Assets, type Order } from "@prisma/client";
import { getRemainingOrders } from "../server/api/routers/Console/utils/getOpenPositions";

const getRemainingOrdersData: (Assets & { Orders: Order[] })[] = [
  {
    id: "cm1dgwucn0001bfi2rt0s55fk",
    name: "ETH",
    lockedAmount: 0,
    freeAmount: 10,
    TradingAccountId: "cm1demfyw0006t3khdg50dul1",
    Orders: [
      {
        id: 47,
        openedAt: new Date("2024-09-24T07:39:27.658Z"),
        closedAt: new Date("2024-09-24T07:39:27.658Z"),
        name: "ETHUSDT",
        quantity: 10,
        price: 2641.95,
        type: "BUY",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 48,
        openedAt: new Date("2024-09-24T07:40:26.819Z"),
        closedAt: new Date("2024-09-24T07:40:26.819Z"),
        name: "ETHUSDT",
        quantity: 10,
        price: 2641.95,
        type: "SELL",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 49,
        openedAt: new Date("2024-09-24T07:48:56.093Z"),
        closedAt: new Date("2024-09-24T07:48:56.093Z"),
        name: "ETHUSDT",
        quantity: 10,
        price: 2644.72,
        type: "BUY",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 50,
        openedAt: new Date("2024-09-24T07:49:05.646Z"),
        closedAt: new Date("2024-09-24T07:49:05.646Z"),
        name: "ETHUSDT",
        quantity: 10,
        price: 2644.11,
        type: "SELL",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 51,
        openedAt: new Date("2024-09-24T07:49:38.075Z"),
        closedAt: new Date("2024-09-24T07:49:38.075Z"),
        name: "ETHUSDT",
        quantity: 37,
        price: 2643.6,
        type: "BUY",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 52,
        openedAt: new Date("2024-09-24T07:51:20.177Z"),
        closedAt: new Date("2024-09-24T07:51:20.177Z"),
        name: "ETHUSDT",
        quantity: 37,
        price: 2644.69,
        type: "SELL",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 53,
        openedAt: new Date("2024-09-24T07:58:04.365Z"),
        closedAt: new Date("2024-09-24T07:58:04.365Z"),
        name: "ETHUSDT",
        quantity: 10,
        price: 2646.01,
        type: "BUY",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 54,
        openedAt: new Date("2024-09-24T08:01:09.082Z"),
        closedAt: new Date("2024-09-24T08:01:09.082Z"),
        name: "ETHUSDT",
        quantity: 1,
        price: 2646,
        type: "BUY",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
      {
        id: 55,
        openedAt: new Date("2024-09-24T08:01:14.665Z"),
        closedAt: new Date("2024-09-24T08:01:14.665Z"),
        name: "ETHUSDT",
        quantity: 1,
        price: 2646,
        type: "SELL",
        status: "COMPLETED",
        triggerType: "MARKET",
        TradingAccountId: "cm1demfyw0006t3khdg50dul1",
        AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
      },
    ],
  },
];

const getRemainingOrdersResult = {
  Orders: [
    {
      id: 53,
      openedAt: new Date("2024-09-24T07:58:04.365Z"),
      closedAt: new Date("2024-09-24T07:58:04.365Z"),
      name: "ETHUSDT",
      quantity: 9,
      price: 2646.01,
      type: "BUY",
      status: "COMPLETED",
      triggerType: "MARKET",
      TradingAccountId: "cm1demfyw0006t3khdg50dul1",
      AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
    },
    {
      id: 54,
      openedAt: new Date("2024-09-24T08:01:09.082Z"),
      closedAt: new Date("2024-09-24T08:01:09.082Z"),
      name: "ETHUSDT",
      quantity: 1,
      price: 2646,
      type: "BUY",
      status: "COMPLETED",
      triggerType: "MARKET",
      TradingAccountId: "cm1demfyw0006t3khdg50dul1",
      AssetsId: "cm1dgwucn0001bfi2rt0s55fk",
    },
  ],
  TradingAccountId: "cm1demfyw0006t3khdg50dul1",
  freeAmount: 10,
  id: "cm1dgwucn0001bfi2rt0s55fk",
  lockedAmount: 0,
  name: "ETH",
};

describe("Math functions", () => {
  test("parsePrice passed", () => {
    const result = getRemainingOrders(getRemainingOrdersData);
    const expectedResult = getRemainingOrdersResult;

    // Check overall structure and relevant properties
    const expectedPositionDetails = { avgPrice: 2646.009, quantity: 10, totalPrice: 26460.09 };
    const gotPositionDetails = result[0]?.PositionDetails;

    // Assert that gotPositionDetails exists
    expect(gotPositionDetails).toBeDefined();
    if (!gotPositionDetails) return;

    // Use toBeCloseTo for avgPrice and totalPrice comparisons
    expect(gotPositionDetails.avgPrice).toBeCloseTo(expectedPositionDetails.avgPrice, 10);
    expect(gotPositionDetails.totalPrice).toBeCloseTo(expectedPositionDetails.totalPrice, 10);

    const expectedData = {
      TradingAccountId: expectedResult.TradingAccountId,
      freeAmount: expectedResult.freeAmount,
      lockedAmount: expectedResult.lockedAmount,
      name: expectedResult.name,
      id: expectedResult.id,
      Orders: expectedResult.Orders,
      PositionDetails: { ...gotPositionDetails },
    };

    // Check the structure of the result
    expect(result[0]).toMatchObject(expectedData);
  });
});
