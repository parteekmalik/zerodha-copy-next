import { $Enums } from "@prisma/client";
import { sumByKey } from "../divideOrders";

export type TorderDetails = {
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
};
export type TOrder = {
  id: string;
  createdAt: Date;
  name: string;
  type: $Enums.OrderType;
  price: number;
  quantity: number;
  status: $Enums.OrderStatus;
  triggerType: $Enums.EtriggerType;
  sl: number;
  tp: number;
  TradingAccountId: string;
};
export function divideIntoBUYSELL(Trades: TorderDetails[]) {
  const buyList = Trades.filter((i) => i.type === "BUY");
  const sellList = Trades.filter((i) => i.type === "SELL");
  return { buyList, sellList };
}
export function divdeIntoClosedOpen(
  buyTrades: TorderDetails[],
  sellTrades: TorderDetails[],
) {
  return remaingOrders(
    [...buyTrades],
    [...sellTrades],
    sumByKey(sellTrades, "quantity"),
  );
}
export function remaingOrders(
  buyList: TorderDetails[],
  sellList: TorderDetails[],
  commonQty: number,
) {
  let buyquantity = 0;
  const buyCommonList = [];
  while (
    buyList.length &&
    buyquantity + (buyList[0]?.quantity ?? 0) < commonQty
  ) {
    const order = buyList.shift();
    if (order) {
      buyCommonList.push(order);
      buyquantity += order.quantity;
    }
  }
  //   console.log("common total", buytotal, selltotal);

  if (buyquantity < commonQty) {
    const leftQty = commonQty - buyquantity;
    const order = buyList.shift();
    if (order) {
      buyCommonList.push({
        type: order.type,
        price: order.price,
        quantity: leftQty,
      });

      buyList.push({
        type: order.type,
        price: order.price,
        quantity: order.quantity - leftQty,
      });
    } else console.log("an error encountered");
  }
  //   console.log("total", buytotal, selltotal);
  //   console.log("common profit", profitOrLoss, buyList);

  return {
    ClosedTrades: { buyTrades: buyCommonList, sellTrades: sellList },
    openTrades: buyList,
  };
}
export function calTotalPrice(list: TorderDetails[]) {
  let Cost = 0;
  list.map((i) => {
    Cost += i.price * i.quantity;
  });
  return Cost;
}
