
export const parsePrice = (price: string | undefined) => {
  if (price === undefined) return 0;
  // const Fprice = parseFloat(price);
  // const pointOnePer = String(Fprice);
  // let count = 1;
  // let index = 0;
  // for (; index < pointOnePer.length; index++) {
  //   if (pointOnePer[index] === ".") break;
  // }
  // index++;
  // for (; index < pointOnePer.length; index++) {
  //   if (pointOnePer[index] !== "0") break;
  //   count++;
  // }
  // count += 4;
  // return Number(parseFloat(price).toFixed(Math.max(2, count)));
  return Number(price);
};
export function searchAndSort(
  searchTerm: string,
  array: string[],
  notInclude: string[],
): string[] {
  searchTerm = searchTerm.toUpperCase();
  const ranking: Record<number, string> = {};
  let rankinglist: string[] = [];
  array.filter((item) => {
    for (let i = 0; i < item.length - searchTerm.length; i++) {
      if (item.slice(i, i + searchTerm.length) === searchTerm) {
        if (ranking[i]) ranking[i] += " " + item;
        else ranking[i] = item;
        return item;
      }
    }
  });
  Object.keys(ranking).map((key) => {
    rankinglist = [
      ...rankinglist,
      ...(ranking[Number(key)]?.split(" ") ?? []).sort(),
    ];
  });
  rankinglist = rankinglist.filter((item) => !notInclude.includes(item));
  return rankinglist.slice(0, 20);
}
export function listToRecord<T>(list: T[], key: keyof T): Record<string, T> {
  return list.reduce(
    (record, item) => {
      const keyValue = item[key];
      if (keyValue !== undefined) {
        record[String(keyValue)] = item;
      }
      return record;
    },
    {} as Record<string, T>,
  );
}
export type TcalculateTradesSummaryFIFO = {
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
};
export function calculateTradesSummaryFIFO(
  trades: TcalculateTradesSummaryFIFO[],
  currentPrice: number,
) {
  const buyTrades = trades.filter((item) => item.type === "BUY");
  const sellTrades = trades.filter((item) => item.type === "SELL");
  let netQuantity = 0;
  trades.map((item) => {
    if (item.type === "BUY") netQuantity += item.quantity;
    else netQuantity -= item.quantity;
  });
  const { profitOrLoss, avgPrice } = helper(
    netQuantity > 0
      ? { List1: buyTrades, List2: sellTrades }
      : { List2: buyTrades, List1: sellTrades },
  );

  return {
    avgPrice,
    netQuantity,
    profitOrLoss,
  };
}
function helper({
  List1,
  List2,
}: {
  List1: TcalculateTradesSummaryFIFO[];
  List2: TcalculateTradesSummaryFIFO[];
}) {
  const totalCost = 0;
  let profitOrLoss = 0;
  while (List2.length) {
    // console.log("list1,list2 ->", List1, List2);
    const first = List1[0];
    const second = List2[0];
    if (first && second) {
      const commonQ = Math.min(first.quantity, second.quantity);
      profitOrLoss += commonQ * (second.price - first.price);
      if (first.quantity === commonQ) List1.shift();
      else {
        first.quantity -= commonQ;
      }
      if (second.quantity === commonQ) List2.shift();
      else {
        second.quantity -= commonQ;
      }
    }
    // console.log("list1,list2 ->", List1, List2);
  }
  return { profitOrLoss, avgPrice: AvgPrice(List1), totalCost };
}
function AvgPrice(list: TcalculateTradesSummaryFIFO[]) {
  // console.log("list avgprice ->", list);
  let totalQuantity = 0;
  let totalPrice = 0;

  for (const item of list) {
    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.price;
  }
  // console.log(totalPrice, totalQuantity);
  const avgPrice = totalPrice / totalQuantity;

  return totalQuantity === 0 ? 0 : avgPrice.toFixed(2);
}
