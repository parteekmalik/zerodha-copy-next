import { useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";

import TsMap from "ts-map";
import SymbolLiveContext from "~/app/zerodha/_contexts/SymbolLive/SymbolLive";
import Table from "../Table/table";
import open_close_Trades, {
  TOrderCalculations,
} from "./functions/OrderCalculations";
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

  const [orderMap, setorderMap] = useState<{
    open: TsMap<string, TOrderCalculations>;
    close: TsMap<string, TOrderCalculations>;
  }>(open_close_Trades([]));

  useEffect(() => {
    if (typeof ordersQuery.data === "object") {
      console.log("new class");
      setorderMap(open_close_Trades(ordersQuery.data));
    }
  }, [ordersQuery.data]);

  useEffect(() => {
    console.log(orderMap);
  }, [orderMap]);
  const closedOrdersData = (list: TsMap<string, TOrderCalculations>) => {
    return list.keys().map((key, i) => {
      const value = list.get(key);
      let data: (string | number)[] = [];
      if (value) {
        const QUANTITY = value.BuyQuantity - value.SellQuantity;
        const AVG = value.BuyPriceTotal / value.BuyQuantity;
        const CURPRICE = symbolLiveState.Livestream[key]?.curPrice ?? "0.00";
        const PROFIT = value.SellPriceTotal - value.BuyPriceTotal;
        const CHANGE =
          ((Number(PROFIT) / value.BuyPriceTotal) * 100 - 100).toFixed(2) + "%";
        if (QUANTITY === 0) {
          data = [
            "SPOT",
            key,
            QUANTITY,
            "0.00",
            CURPRICE,
            PROFIT.toFixed(2),
            "0.00%",
          ];
        } else
          data = [
            "SPOT",
            key,
            QUANTITY,
            AVG,
            CURPRICE,
            (
              value.BuyQuantity *
                (symbolLiveState.Livestream[key]?.curPrice ?? 1) -
              PROFIT
            ).toFixed(2),
            CHANGE,
          ];
      }
      return {
        id: "" + i,
        data,
      };
    });
  };
  if (typeof ordersQuery.data === "string") return <>{ordersQuery}</>;
  return (
    <>
      <div className="w-full bg-white">
        <div className="flex w-full p-2">
          <span className="grow text-[1.125rem] text-[#444444]">
            Open orders ({orderMap?.open.size})
          </span>
        </div>
        <div className="flex w-full items-center justify-center">
          <Table
            stylesList={position_stylesList}
            options={{ colorIndex: { quantity: 2, list: [2, 5, 6] } }}
            headings={headings}
            dataList={closedOrdersData(orderMap.open)}
          />
        </div>
        {/* <div style={{ wordWrap: "break-word" }}>{JSON.stringify(orders)}</div> */}
      </div>
      <div className="w-full bg-white">
        <div className="flex w-full p-2">
          <span className="grow text-[1.125rem] text-[#444444]">
            Closed orders ({orderMap?.close.size})
          </span>
        </div>
        <div className="flex w-full items-center justify-center">
          <Table
            stylesList={position_stylesList}
            options={{ colorIndex: { quantity: 2, list: [2, 5, 6] } }}
            headings={headings}
            dataList={closedOrdersData(orderMap.close)}
          />
        </div>
        {/* <div style={{ wordWrap: "break-word" }}>{JSON.stringify(orders)}</div> */}
      </div>
    </>
  );
}

export default Positions;