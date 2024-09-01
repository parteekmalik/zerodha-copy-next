"use client";
import { Order as TOrder } from "@prisma/client";
import { useMemo } from "react";
import { api } from "~/trpc/react";

const stylesList = {
  padding: " p-[10px_12px] ",
  table: "m-2 w-full",
  head: "border-b-2 text-xs  text-darkGrayApp",
  body: "text-center text-sm text-textDark",
  row: { Price: " border-r " },
};
const headings: Array<keyof TOrder> = [
  "openedAt",
  "type",
  "name",
  "quantity",
  "price",
  "status",
];
function Order() {
  const orders = api.Order.getOrders.useQuery().data;
  const { openOrders, closedOrders } = useMemo(() => {
    return {
      openOrders:
        typeof orders === "object"
          ? orders.filter((i) => i.status === "OPEN")
          : [],
      closedOrders:
        typeof orders === "object"
          ? orders.filter((i) => i.status !== "OPEN")
          : [],
    };
  }, [orders]);

  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col">
      <div className="flex w-full p-2">
        <span className="text-textDark grow text-lg">
          Pending Trades ({openOrders.length})
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
          {openOrders.map((valueList, index) => {
            return (
              <tr className="hover:bg-lightGrayApp" key={valueList.id}>
                {headings.map((key, index) => {
                  return (
                    <td
                      // className={
                      //   " " +
                      //   (colorIndex.includes(key) ||
                      //   (key === "SL" &&
                      //     valueList.data.closePrice === valueList.data.SL) ||
                      //   (key === "TP" &&
                      //     valueList.data.closePrice === valueList.data.TP)
                      //     ? getColor(valueList.data[key] ?? 0)
                      //     : " ")
                      // }
                      key={valueList.id + key}
                    >
                      {JSON.stringify(valueList[key])}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex w-full p-2">
        <span className="text-textDark grow text-lg">
          Executed Trades ({closedOrders.length})
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
          {closedOrders.map((valueList, index) => {
            return (
              <tr className="hover:bg-lightGrayApp" key={valueList.id}>
                {headings.map((key, index) => {
                  return (
                    <td
                      // className={
                      //   " " +
                      //   (colorIndex.includes(key) ||
                      //   (key === "SL" &&
                      //     valueList.data.closePrice === valueList.data.SL) ||
                      //   (key === "TP" &&
                      //     valueList.data.closePrice === valueList.data.TP)
                      //     ? getColor(valueList.data[key] ?? 0)
                      //     : " ")
                      // }
                      key={valueList.id + key}
                    >
                      {JSON.stringify(valueList[key])}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Order;
// const colorIndex = ["P&L", "Chenge"];
// const dataList = Array.isArray(orders)
//   ? orders.map((item) => {
//       const LTP = item.closePrice;
//       const PnL = LTP === 0 ? 0 : (LTP - item.openPrice) * item.quantity;
//       const change = LTP === 0 ? 0 : (LTP / item.openPrice) * 100 - 100;
//       return {
//         id: item.id,
//         data: {
//           Time:
//             item.openedAt.toDateString().split(" ").slice(1).join(" ") +
//             item.openedAt.toTimeString().split(" ")[0],
//           Type: item.type,
//           Instrument: item.name,
//           Quantity:
//             (item.status === "CANCELLED" ? 0 : item.quantity) +
//             `/${item.quantity}`,
//           Price: item.openPrice,
//           closePrice: item.closePrice,
//           Status: item.status,
//           SL: item.sl,
//           TP: item.tp,
//           "P&L": PnL.toFixed(2),
//           Chenge: change.toFixed(2) + "%",
//         } as Record<string, string | number>,
//       };
//     })
//   : [];
{
  /* <tfoot className="bg-lightGrayApp text-center">
          <tr>
            <td colSpan={6}></td>
            <td>Total</td>
            <td
              className={getColor(
                sumByKey(
                  dataList.map((i) => {
                    return { ...i.data };
                  }),
                  "P&L",
                ),
              )}
            >
              {sumByKey(
                dataList.map((i) => {
                  return { ...i.data };
                }),
                "P&L",
              ).toFixed(2)}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot> */
}
