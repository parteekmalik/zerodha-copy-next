import { useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";

import SymbolLiveContext from "~/app/zerodha/_contexts/SymbolLive/SymbolLive";
import { TOrder } from "../Order";
import { calculations } from "./utils";
import Table from "../Table/table";
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
function Holdings() {
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
    <div className="w-full bg-white p-[20px_20px_20px_30px] min-h-full">
      <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
          Holdings ({dataList?.length})
        </span>
      </div>
      <div className="flex w-full ">
        <div className="flex grow flex-col items-center justify-center">
          <span className={position_stylesList.head}>Total investment</span>
          <span>({dataList?.length})</span>
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <span>Current value</span>
          <span>21651</span>
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <span>Day's P&L</span>
          <span>54546</span>
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <span>Total P&L</span>
          <span>516</span>
        </div>
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

export default Holdings;
