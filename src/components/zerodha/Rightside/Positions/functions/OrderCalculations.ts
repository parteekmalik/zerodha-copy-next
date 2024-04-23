import TsMap from "ts-map";
import { TOrder, remaingOrders } from "./utils";

export function sumByKey<T>(list: T[], key: keyof T): number {
  return list.reduce((total, item) => total + Number(item[key]), 0);
}

export function calTotalPrice(list: TOrder[]) {
  let Cost = 0;
  list.map((i) => {
    Cost += i.price * i.quantity;
  });
  return Cost;
}

export type TOrderCalculations = {
  BuyQuantity: number;
  SellQuantity: number;
  BuyPriceTotal: number;
  SellPriceTotal: number;
  buyTrades: TOrder[];
  sellTrades: TOrder[];
};
export function OrderCalculations(
  buyTrades: TOrder[],
  sellTrades: TOrder[],
): TOrderCalculations {
  return {
    buyTrades,
    sellTrades,
    BuyQuantity: sumByKey(buyTrades, "quantity"),
    SellQuantity: sumByKey(sellTrades, "quantity"),
    BuyPriceTotal: calTotalPrice(buyTrades),
    SellPriceTotal: calTotalPrice(sellTrades),
  };
}

export function fillOrderMap(orders: TOrder[]) {
  const orderMap = new TsMap<string, TOrder[]>();
  orders.map((order) => {
    if (orderMap.get(order.name)) orderMap.get(order.name)?.push(order);
    else orderMap.set(order.name, [order]);
  });
  return orderMap;
}
export function divideIntoBUYSELL(Trades: TOrder[]) {
  const buyList = Trades.filter((i) => i.type === "BUY");
  const sellList = Trades.filter((i) => i.type === "SELL");
  return { buyList, sellList };
}

export function divdeIntoClosedOpen(buyTrades: TOrder[], sellTrades: TOrder[]) {
  return remaingOrders(
    [...buyTrades],
    [...sellTrades],
    sumByKey(sellTrades, "quantity"),
  );
}

export function open_close_Trades(orders: TOrder[]) {
  // console.log("filling orderDetailsMap");

  orders = orders.filter((i) => i.status === "completed");

  const orderMap = fillOrderMap(orders);
  console.log("orderMap", orderMap);
  const orderDetailsMap = {
    open: new TsMap<string, TOrderCalculations>(),
    close: new TsMap<string, TOrderCalculations>(),
  };
  orderMap.forEach((value, key, map) => {
    if (key && value && map) {
      const { buyList, sellList } = divideIntoBUYSELL(value);
      const res = divdeIntoClosedOpen([...buyList], [...sellList]);
      console.log("divdeIntoClosedOpen", res);
      if (res.openTrades.length)
        orderDetailsMap.open.set(key, OrderCalculations(res.openTrades, []));
      if (
        res.ClosedTrades.buyTrades.length &&
        res.ClosedTrades.sellTrades.length
      )
        orderDetailsMap.close.set(
          key,
          OrderCalculations(
            res.ClosedTrades.buyTrades,
            res.ClosedTrades.sellTrades,
          ),
        );
    }
  });
  return orderDetailsMap;
}
