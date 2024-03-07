import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { TOrder, Table, stylesList } from "./Order";
import {
  TcalculateTradesSummaryFIFO,
  calculateTradesSummaryFIFO,
} from "../../utils";
const headings = [
  "Product",
  "Instrument",
  "Quantity",
  "AVG",
  "LTP",
  "P&L",
  "change",
];
function Positions() {
  const orders = api.accountInfo.getOrders.useQuery().data;
  // const [orderMap, setOrderMap] = useState<{ [key: string]: TOrder[] }>({});
  const [dataList, setdataList] = useState<(string | number)[][]>([]);
  useEffect(() => {
    console.log(orders);
    if (typeof orders !== "string" && orders !== undefined) {
      const temporderMap: Record<string, TOrder[]> = {};
      orders
        .filter((item) => item.status === "completed")
        .map((item) => {
          temporderMap[item.name]
            ? temporderMap[item.name]?.push(item)
            : (temporderMap[item.name] = [item]);
        });
      console.log(temporderMap);
      setdataList(
        Object.keys(temporderMap).map((key) => {
          const answer = calculations(temporderMap, key);
          return [
            answer.Product,
            answer.Instrument,
            answer.Quantity,
            answer.AVG,
            answer.LTP,
            answer.change,
          ];
        }),
      );
      // setOrderMap(temporderMap);
    }
  }, [orders]);
  if (typeof orders === "string") return <>{orders}</>;

  return (
    <div className="w-full bg-white">
      <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
          Open orders ({dataList?.length})
        </span>
      </div>
      <div className="flex w-full items-center justify-center">
        <Table
          stylesList={stylesList}
          options={{ isSelect: true }}
          headings={headings}
          dataList={dataList}
        />
      </div>
    </div>
  );
}
type Tanswer = {
  Product: string;
  Instrument: string;
  Quantity: number;
  AVG: number;
  LTP: string;
  "P&L": number;
  change: number;
};
function calculations(orderMap:  Record<string, TOrder[]>, key: string) {
  const orders = orderMap[key];

  const answer: Tanswer = {
    Product: "SPOT",
    Instrument: key,
    Quantity: 0,
    AVG: 0,
    LTP: "LTP",
    "P&L": 0,
    change: 0,
  };
  if (orders) {
    const { avgPrice, profitOrLoss, netQuantity } = calculateTradesSummaryFIFO(
      orders.map((item) => {
        return {
          type: item.type,
          quantity: item.filledAmount,
          price: item.avgPrice,
        };
      }) as TcalculateTradesSummaryFIFO[],
      0,
    );
    answer.AVG = Number(avgPrice);
    answer["P&L"] = profitOrLoss;
    answer.Quantity = netQuantity;
  }
  return answer;
}

export default Positions;
