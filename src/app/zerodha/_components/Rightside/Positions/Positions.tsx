import { useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";

import { TOrder } from "../Order";
import Table from "../Table/table";
import {
  TcalculateTradesSummaryFIFO,
  calculateTradesSummaryFIFO,
  calculations,
} from "./utils";
import SymbolLiveContext from "~/app/zerodha/_contexts/SymbolLive/SymbolLive";
const headings = [
  "Product",
  "Instrument",
  "Quantity",
  "AVG",
  "LTP",
  "P&L",
  "change",
];
const position_stylesList = {
  padding: " p-[10px_12px] ",
  table: " m-2 w-full ",
  head: " border-b-2 text-[.75rem]  text-[#9b9b9b] ",
  body: " text-center text-[14px] text-[#444444] ",
  row: ["  ", "  ", "", "  ", "  ", "", " border-r ", ""],
};

function Positions() {
  const ordersQuery = api.orders.getOrders24hr.useQuery();
  const { symbolLiveState, socketSend } = useContext(SymbolLiveContext);
  // const [orderMap, setOrderMap] = useState<{ [key: string]: TOrder[] }>({});
  const [dataList, setdataList] = useState<
    {
      id: string;
      data: (string | number)[];
    }[]
  >([]);
  const [temporderMap, settemporderMap] = useState<Record<string, TOrder[]>>(
    {},
  );

  useEffect(() => {
    if (typeof ordersQuery.data === "object") {
      const prev: Record<string, TOrder[]> = {};
      ordersQuery.data
        .filter((item) => item.status === "completed")
        .forEach((item) => {
          prev[item.name] = prev[item.name]
            ? [...(prev[item.name] ?? []), item]
            : [item];
        });
      settemporderMap(prev);
    }
    console.log("temporderMap", temporderMap);
  }, [ordersQuery.data]);

  useEffect(() => {
    function getStats(key: string) {
      const answer = calculations(
        [...(temporderMap[key] ?? [])],
        symbolLiveState.Livestream[key]?.curPrice ?? 0,
      );
      return {
        id: "",
        data: [
          answer.Product,
          answer.Instrument,
          answer.Quantity,
          answer.AVG,
          answer.LTP,
          answer["P&L"],
          answer.change,
        ],
      };
    }
    const temp = Object.keys(temporderMap).map((key) => {
      return getStats(key);
    });
    if (JSON.stringify(temp) !== JSON.stringify(dataList)) setdataList(temp);
  }, [symbolLiveState.Livestream]);

  if (typeof ordersQuery.data === "string") return <>{ordersQuery}</>;
  return (
    <div className="w-full bg-white">
      <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
          Open orders ({dataList?.length})
        </span>
      </div>
      <div className="flex w-full items-center justify-center">
        <Table
          stylesList={position_stylesList}
          options={{ colorIndex: { quantity: 2, list: [2, 5, 6] } }}
          headings={headings}
          dataList={dataList}
        />
      </div>
      {/* <div style={{ wordWrap: "break-word" }}>{JSON.stringify(orders)}</div> */}
    </div>
  );
}

export default Positions;
