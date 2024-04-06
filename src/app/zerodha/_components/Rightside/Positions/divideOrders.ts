import { TOrder } from "../Order";
import { TcalculateTradesSummaryFIFO } from "./utils";

export function divideIntoBUYSELL(orders: TOrder[]) {
  const Trades = orders.map((item) => {
    return {
      type: item.type,
      quantity: item.quantity,
      price: item.price,
    };
  }) as TcalculateTradesSummaryFIFO[];
  const buyList = Trades.filter((i) => i.type === "BUY");
  const sellList = Trades.filter((i) => i.type === "SELL");
  return divdeIntoClosedOpen(buyList, sellList);
}
export function divdeIntoClosedOpen(
  buyTrades: TcalculateTradesSummaryFIFO[],
  sellTrades: TcalculateTradesSummaryFIFO[],
) {
  const [buyTotalQty, sellTotalQty] = [
    sumByKey(buyTrades, "quantity"),
    sumByKey(sellTrades, "quantity"),
  ];
  const commonQty = Math.min(buyTotalQty, sellTotalQty);
  const { buyList: openTrades } = remaingOrders(
    [...buyTrades],
    [...sellTrades],
    commonQty,
  );
  return {
    openTrades,
    ClosedTrades: {
      sellTrades,
      buyTrades: buyTrades.filter((item) => !openTrades.includes(item)),
    },
  };
}
export function sumByKey<T>(list: T[], key: keyof T): number {
  return list.reduce((total, item) => total + Number(item[key]), 0);
}
export function remaingOrders(
  buyList: TcalculateTradesSummaryFIFO[],
  sellList: TcalculateTradesSummaryFIFO[],
  commonQty: number,
) {
  const { total: selltotal } = Total_avg_Price(sellList);
  let buytotal = 0;
  let buyquantity = 0;
  while (
    buyList.length &&
    buyquantity + (buyList[0]?.quantity ?? 0) < commonQty
  ) {
    const order = buyList.shift();
    if (order) {
      buyquantity += order.quantity;
      buytotal += order.quantity * order.price;
    }
  }
  //   console.log("common total", buytotal, selltotal);

  if (buyquantity < commonQty) {
    const leftQty = commonQty - buyquantity;
    const order = buyList.shift();
    if (order) {
      buytotal += leftQty * order.price;
      buyList.push({
        type: order.type,
        price: order.price,
        quantity: order.quantity - leftQty,
      });
    } else console.log("an error encountered");
  }
  const profitOrLoss = selltotal - buytotal;
  //   console.log("total", buytotal, selltotal);
  //   console.log("common profit", profitOrLoss, buyList);

  return { profitOrLoss, buyList };
}
export function Total_avg_Price(list: TcalculateTradesSummaryFIFO[]) {
  const { Price, quantity } = list.reduce(
    (prev, cur, i) => {
      // Calculate total quantity and total value
      const totalQuantity = prev.quantity + cur.quantity;
      const totalValue = prev.Price + cur.price * cur.quantity;

      return { quantity: totalQuantity, Price: totalValue };
    },
    { quantity: 0, Price: 0 }, // Initial values for quantity and average price
  );
  console.log("Total_avg_Price", Price, quantity, Price);
  return {
    avg:
      Price === 0 || quantity === 0 ? 0 : Number((Price / quantity).toFixed(2)),
    total: Price,
  };
}
