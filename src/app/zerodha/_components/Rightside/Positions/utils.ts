import { TOrder } from "../Order";

export type TcalculateTradesSummaryFIFO = {
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
};
function sumByKey<T>(list: T[], key: keyof T): number {
  return list.reduce((total, item) => total + Number(item[key]), 0);
}

export function calculateTradesSummaryFIFO(
  trades: TcalculateTradesSummaryFIFO[],
  currentPrice: number,
) {
  const buyTrades = trades.filter((item) => item.type === "BUY");
  const sellTrades = trades.filter((item) => item.type === "SELL");
  const [buyTotalQty, sellTotalQty] = [
    sumByKey(buyTrades, "quantity"),
    sumByKey(sellTrades, "quantity"),
  ];
  const commonQty = Math.min(buyTotalQty, sellTotalQty);
  //   console.log(
  //     "commonQty",
  //     commonQty,
  //     buyTotalQty,
  //     sellTotalQty,
  //     buyTrades,
  //     sellTrades,
  //     trades,
  //   );

  const netQuantity = buyTotalQty - sellTotalQty;
  const temp = helper([...buyTrades], [...sellTrades], commonQty);
  let { profitOrLoss } = temp;
  const { buyList: list } = temp;

  const { avg: avgPrice, total: leftBuytotal } = Total_avg_Price([...list]);
  const leftBuyQty = sumByKey([...list], "quantity");
  profitOrLoss += leftBuyQty * currentPrice - leftBuytotal;
  return {
    avgPrice,
    netQuantity,
    profitOrLoss,
  };
}
function helper(
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
export type Tanswer = {
  Product: string;
  Instrument: string;
  Quantity: number;
  AVG: number | string;
  LTP: string;
  "P&L": number | string;
  leftBuyQty: number;
  change: number | string;
};
export function calculations(orders: TOrder[], price: string | number) {
  // const orders = orderMap[key];
  price = Number(price);

  const answer: Tanswer = {
    Product: "SPOT",
    Instrument: orders[0]?.name ?? "",
    Quantity: 0,
    AVG: 0,
    LTP: price.toFixed(2),
    "P&L": "1",
    change: "-1",
    leftBuyQty: 0,
  };
  if (orders) {
    const { avgPrice, profitOrLoss, netQuantity } = calculateTradesSummaryFIFO(
      orders.map((item) => {
        return {
          type: item.type,
          quantity: item.quantity,
          price: item.price,
        };
      }) as TcalculateTradesSummaryFIFO[],
      price,
    );
    answer.AVG = avgPrice.toFixed(2);
    answer.change =
      (avgPrice === 0
        ? "0.00"
        : ((price / Number(avgPrice)) * 100 - 100).toFixed(2)) + "%";
    answer["P&L"] = profitOrLoss.toFixed(2);
    answer.Quantity = netQuantity;
  }
  return answer;
}
