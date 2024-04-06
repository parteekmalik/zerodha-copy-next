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
import { divideIntoBUYSELL } from "./divideOrders";
import OrdersManage from "./classes/OrderCalculations";
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
  const [dataList, setdataList] = useState<{
    open: {
      id: string;
      data: (string | number)[];
    }[];
    closed: {
      id: string;
      data: (string | number)[];
    }[];
  }>({ open: [], closed: [] });

  const [orderMap, setorderMap] = useState(new OrdersManage([]));

  useEffect(() => {
    if (typeof ordersQuery.data === "object") {
      console.log("new class");
      // setorderMap(new OrdersManage(ordersQuery.data));
    }
  }, [ordersQuery.data]);
  useEffect(() => {
    console.log("temporderMap", orderMap);
  }, [orderMap]);

  if (typeof ordersQuery.data === "string") return <>{ordersQuery}</>;
  return (
    <>
      <div className="w-full bg-white">
        <div className="flex w-full p-2">
          <span className="grow text-[1.125rem] text-[#444444]">
            Open orders ({dataList?.open.length})
          </span>
        </div>
        <div className="flex w-full items-center justify-center">
          <Table
            stylesList={position_stylesList}
            options={{ colorIndex: { quantity: 2, list: [2, 5, 6] } }}
            headings={headings}
            dataList={dataList.open}
          />
        </div>
        {/* <div style={{ wordWrap: "break-word" }}>{JSON.stringify(orders)}</div> */}
      </div>
      <div className="w-full bg-white">
        <div className="flex w-full p-2">
          <span className="grow text-[1.125rem] text-[#444444]">
            Closed orders ({dataList?.closed.length})
          </span>
        </div>
        <div className="flex w-full items-center justify-center">
          <Table
            stylesList={position_stylesList}
            options={{ colorIndex: { quantity: 2, list: [2, 5, 6] } }}
            headings={headings}
            dataList={dataList.closed}
          />
        </div>
        {/* <div style={{ wordWrap: "break-word" }}>{JSON.stringify(orders)}</div> */}
      </div>
    </>
  );
}

export default Positions;
