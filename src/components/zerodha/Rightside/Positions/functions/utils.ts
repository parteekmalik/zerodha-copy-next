import { $Enums } from "@prisma/client";

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
export function remaingOrders(
  buyList: TOrder[],
  sellList: TOrder[],
  commonQty: number,
) {
  let buyquantity = 0;
  const buyCommonList = [];
  // for(let i=0;i<buyList.length;i++){
  //   if(buyquantity + buyList[i] <=)
  // }
  while (
    buyList.length &&
    buyquantity + (buyList[0]?.quantity ?? 0) <= commonQty
  ) {
    const order = buyList.shift();
    if (order) {
      buyCommonList.push(order);
      buyquantity += order.quantity;
    }
  }


  if (buyquantity < commonQty) {
    const leftQty = commonQty - buyquantity;
    const order = buyList.shift();
    if (order) {
      buyCommonList.push({
        ...order,
        quantity: leftQty,
      });

      buyList.push({
        ...order,
        quantity: order.quantity - leftQty,
      });
    } else console.log("an error encountered");
  }

  return {
    ClosedTrades: { buyTrades: buyCommonList, sellTrades: sellList },
    openTrades: buyList,
  };
}
