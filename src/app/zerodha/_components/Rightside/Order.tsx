import { $Enums } from "@prisma/client";
import { useScroll } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
export type TOrder = {
  id: string;
  createsAt: Date;
  name: string;
  type: string;
  status: $Enums.orderStatus;
  price: number;
  avgPrice: number;
  totalAmount: number;
  filledAmount: number;
  sl: number;
  tp: number;
  TradingAccountId: string;
};
export const stylesList = {
  padding: " p-[10px_12px] ",
  table: "m-2",
  head: "border-b-2 text-[.75rem]  text-[#9b9b9b]",
  body: "text-center text-[14px] text-[#444444]",
  row: ["", "", "", "", "", "", " border-r ", ""],
};
function Order() {
  const orders = api.accountInfo.getOrders.useQuery().data;
  const [openOrders, setopenOrders] = useState<TOrder[]>([]);
  const [executedOrders, setexecutedOrders] = useState<TOrder[]>([]);
  useEffect(() => {
    console.log(orders);
    if (typeof orders !== "string" && orders !== undefined) {
      setopenOrders(orders.filter((item) => item.status !== "completed"));
      setexecutedOrders(orders.filter((item) => item.status === "completed"));
    }
  }, [orders]);
  if (typeof orders === "string") return <>{orders}</>;

  return (
    <div className="flex  w-full flex-col bg-white">
      {openOrders.length ? (
        <div className="flex w-full flex-col ">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Open orders ({orders?.length})
            </span>
            <input className="w-[50px]" value={"search"}></input>
          </div>
          <Table
            headings={[
              "Time",
              "Type",
              "Instrument",
              "Product",
              "Quantity",
              "LTP",
              "Price",
              "Status",
            ]}
            stylesList={stylesList}
            dataList={
              openOrders.map((item) => {
                return [
                  item.createsAt.toTimeString().split(" ")[0] ?? "",
                  item.type,
                  item.name,
                  "SPOT",
                  `${item.filledAmount}/${item.totalAmount}`,
                  "LTP",
                  item.price,
                  item.status,
                ];
              }) ?? []
            }
            options={{ isSelect: true }}
          />
        </div>
      ) : null}
      {executedOrders.length ? (
        <div className="flex w-full flex-col">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Executed orders ({orders?.length})
            </span>
          </div>
          <Table
            headings={[
              "Time",
              "Type",
              "Instrument",
              "Product",
              "Quantity",
              "LTP",
              "Price",
              "Status",
            ]}
            stylesList={stylesList}
            dataList={
              executedOrders.map((item) => {
                return [
                  item.createsAt.toTimeString().split(" ")[0] ?? "",
                  item.type,
                  item.name,
                  "SPOT",
                  `${item.filledAmount}/${item.totalAmount}`,
                  "LTP",
                  item.avgPrice,
                  item.status,
                ];
              }) ?? []
            }
            options={{ isSelect: false }}
          />
        </div>
      ) : null}

      <div>{JSON.stringify(orders)}</div>
    </div>
  );
}
export function Table({
  headings,
  stylesList,
  dataList,
}: {
  headings: string[];
  stylesList: {
    row: string[];
    table: string;
    head: string;
    body: string;
    padding: string;
  };
  dataList: (string | number)[][];
  options: { isSelect: boolean };
}) {
  return (
    <table className={stylesList.table}>
      <thead className={stylesList.head}>
        <tr>
          {headings.map((item, i) => {
            return (
              <th
                key={JSON.stringify(item) + i}
                className={stylesList.padding + stylesList.row[i]}
              >
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={stylesList.body}>
        {dataList?.map((items, i) => {
          return (
            <tr key={JSON.stringify(items) + i}>
              {items.map((item, i) => {
                return (
                  <td
                    // using random for key
                    key={JSON.stringify(item) + i}
                    className={stylesList.padding + stylesList.row[i]}
                  >
                    {item}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Order;
