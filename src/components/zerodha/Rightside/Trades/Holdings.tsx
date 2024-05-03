import { useEffect, useMemo, useState } from "react";
import {
  OrderCalculations,
  TOrderCalculations,
  open_close_Trades,
} from "../Positions/functions/OrderCalculations";
import { closed_open_OrdersData } from "../Positions/functions/tableData";
import { api } from "~/trpc/react";
import orders from "../../_redux/Slices/orders";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import Table from "../Table/table";
import moment from "moment";
import TsMap from "ts-map";

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
  row: { LTP: " border-r " },
};
const options = { colorIndex: ["P&L", "change"] };
// TODO: only show position if its bought before 1 day
function Holdings() {
  const ordersQuery = api.orders.getHoldings.useQuery();
  const Livestream = useSelector((state: RootState) => state.Livestream);

  const dataList = useMemo(() => {
    const res = open_close_Trades(
      typeof ordersQuery.data === "string" ? [] : ordersQuery.data ?? [],
    );
    const temp: TsMap<string, TOrderCalculations> = new TsMap();
    res.open.forEach((value, key, map) => {
      if (value && key && map) {
        const newBuyOrders = value.buyTrades.filter(
          (item) => item.createdAt < moment().startOf("day").toDate(),
        );
        temp.set(key, OrderCalculations(newBuyOrders, []));
      }
    });
    console.log("trmp", temp);
    return closed_open_OrdersData(temp, Livestream);
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
          options={options}
          headings={headings}
          dataList={dataList}
        />
      </div>
      <div style={{ wordWrap: "break-word" }}>{JSON.stringify(dataList)}</div>
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
  const investedTotal = 0;
  const CurrentTotal = 0;
  List.forEach((value) => {
    // invested += ;
    // CurrentTotal += value.data[]
  });
  return { investedTotal, CurrentTotal };
}
