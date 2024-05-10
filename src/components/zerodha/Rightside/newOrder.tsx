import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { RootState } from "../_redux/store";

import { $Enums } from "@prisma/client";
import { getColor } from "../WatchList/drag_drop_wishlist/Item";

const stylesList = {
  padding: " p-[10px_12px] ",
  table: "m-2 w-full",
  head: "border-b-2 text-[.75rem]  text-[#9b9b9b]",
  body: "text-center text-[14px] text-[#444444]",
  row: { Price: " border-r " },
};
const headings = [
  "Time",
  "Type",
  "Instrument",
  "Quantity",
  "Price",
  "SL",
  "TP",
  "P&L",
  "Chenge",
  "Status",
];
function Order() {
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );
  const { data: orders, isLoading } =
    api.Trades.getCancel_ClosedTrades.useQuery(TradingAccountId);

  const colorIndex = useRef(["P&L", "Chenge"]);

  const dataList = useMemo(() => {
    if (orders !== undefined && typeof orders !== "string")
      return orders.map((item) => {
        const LTP = item.closePrice;
        const PnL = LTP === 0 ? 0 : (LTP - item.openPrice) * item.quantity;
        const change = LTP === 0 ? 0 : (LTP / item.openPrice) * 100 - 100;
        return {
          id: item.id,
          data: {
            Time: item.openedAt.toTimeString().split(" ")[0] ?? "",
            Type: item.type,
            Instrument: item.name,
            Quantity:
              (item.status === "CANCELLED" ? 0 : item.quantity) +
              `/${item.quantity}`,
            Price: item.openPrice,
            Status: item.status,
            SL: item.sl,
            TP: item.tp,
            "P&L": PnL.toFixed(2),
            Chenge: change.toFixed(2) + "%",
          } as Record<string, string | number>,
        };
      });
    else return [];
  }, [orders]);
  useEffect(() => console.log(dataList), [dataList]);

  if (isLoading) return <>loading...</>;
  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col">
      <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
          Executed Trades ({dataList.length})
        </span>
      </div>
      <table className={stylesList.table}>
        <thead className={stylesList.head}>
          <tr>
            {headings.map((value) => {
              return <th key={"heading" + value}>{value}</th>;
            })}
          </tr>
        </thead>
        <tbody className={stylesList.body}>
          {dataList.map((valueList, index) => {
            return (
              <tr className="hover:bg-[#f9f9f9]" key={valueList.id}>
                {headings.map((key, index) => {
                  return (
                    <td
                      className={
                        " " +
                        (colorIndex.current.includes(key)
                          ? getColor(valueList.data[key] ?? 0)
                          : " ")
                      }
                      key={valueList.id + key}
                    >
                      {valueList.data[key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
}

export default Order;
