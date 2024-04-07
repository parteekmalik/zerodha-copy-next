import { useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";

import TsMap from "ts-map";
import SymbolLiveContext from "~/app/zerodha/_contexts/SymbolLive/SymbolLive";
import open_close_Trades, {
  TOrderCalculations,
} from "../Positions/functions/OrderCalculations";
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
  const { closed_open_OrdersData } = useContext(SymbolLiveContext);
  const [dataList, setdataList] = useState(
    closed_open_OrdersData(open_close_Trades([]).open),
  );
useEffect(()=>console.log("dataList",dataList),[dataList])
  useEffect(() => {
    if (typeof ordersQuery.data === "object") {
      setdataList(
        closed_open_OrdersData(open_close_Trades(ordersQuery.data).open),
      );
    }
  }, [ordersQuery.data]);

  if (typeof ordersQuery.data === "string") return <>{ordersQuery}</>;
  return (
    <div className="min-h-full w-full bg-white p-[20px_20px_20px_30px]">
      <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
          Holdings ({dataList.length})
        </span>
      </div>
      <div className="flex w-full ">
        <div className="flex grow flex-col items-center justify-center">
          <span className={position_stylesList.head}>Total investment</span>
          <span>{current_invested_cal(dataList).investedTotal}</span>
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <span>Current value</span>
          <span>{current_invested_cal(dataList).investedTotal}</span>
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <span>{`Day's P&L`}</span>
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
//  TODO:finish it
function current_invested_cal(
  List: {
    id: string;
    data: {
      Product: string;
      Instrument: string;
      Quantity: number;
      AVG: number;
      LTP: number;
      "P&L": string;
      change: string;
    };
  }[],
) {
  let investedTotal = 0;
  let CurrentTotal = 0;
  List.forEach((value) => {
    // invested += ;
    // CurrentTotal += value.data[]
  });
  return { investedTotal, CurrentTotal };
}
