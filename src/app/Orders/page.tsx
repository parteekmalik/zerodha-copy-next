import { sumByKey } from "~/lib/zerodha/utils";
import { api } from "~/trpc/server";
import { getColor } from "../utils";

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
async function Order() {
  const orders = await api.Trades.getCancel_ClosedTrades.query();
  const colorIndex = ["P&L", "Chenge"];

  const dataList = Array.isArray(orders)
    ? orders.map((item) => {
        const LTP = item.closePrice;
        const PnL = LTP === 0 ? 0 : (LTP - item.openPrice) * item.quantity;
        const change = LTP === 0 ? 0 : (LTP / item.openPrice) * 100 - 100;
        return {
          id: item.id,
          data: {
            Time:
              item.openedAt.toDateString().split(" ").slice(1).join(" ") +
              item.openedAt.toTimeString().split(" ")[0],
            Type: item.type,
            Instrument: item.name,
            Quantity:
              (item.status === "CANCELLED" ? 0 : item.quantity) +
              `/${item.quantity}`,
            Price: item.openPrice,
            closePrice: item.closePrice,
            Status: item.status,
            SL: item.sl,
            TP: item.tp,
            "P&L": PnL.toFixed(2),
            Chenge: change.toFixed(2) + "%",
          } as Record<string, string | number>,
        };
      })
    : [];

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
                        (colorIndex.includes(key) ||
                        (key === "SL" &&
                          valueList.data.closePrice === valueList.data.SL) ||
                        (key === "TP" &&
                          valueList.data.closePrice === valueList.data.TP)
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
        <tfoot className="bg-[#f9f9f9] text-center">
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
        </tfoot>
      </table>
    </div>
  );
}

export default Order;
