"use client";

import { useContext, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { api } from "~/trpc/react";

import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { RootState } from "~/components/zerodha/_redux/store";
import { sumByKey } from "~/lib/zerodha/utils";
import { getColor } from "../utils";

const headings = ["Instrument", "Quantity", "Price", "LTP", "P&L", "change"];
const position_stylesList = {
  padding: " p-[10px_12px] ",
  table: " m-2 w-full ",
  head: " border-b-2 text-[.75rem]  text-[#9b9b9b] ",
  body: " text-center text-[14px] text-textDark ",
  row: { LTP: " border-r " },
};

function Positions() {
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );
  const ordersQuery = api.Order.getRemainingFilledOrders.useQuery().data;
  const APIutils = api.useUtils();

  const Livestream = useSelector((state: RootState) => state.Livestream);

  const dataList = useMemo(() => {
    if (typeof ordersQuery !== "object") return ordersQuery;
    else {
      const res = ordersQuery.map((asset) => {
        const LTP =
          Number(Livestream[asset.Orders[0]?.name ?? ""]?.curPrice) ?? 0;
        const PnL =
          LTP === 0
            ? 0
            : (LTP - asset.PositionDetails.avgPrice) *
              asset.PositionDetails.quantity;
        const change =
          LTP === 0 ? 0 : (LTP / asset.PositionDetails.avgPrice) * 100 - 100;

        return {
          id: asset.id,
          data: {
            Instrument: asset.name,
            Quantity: asset.PositionDetails.quantity,
            Price: asset.PositionDetails.avgPrice,
            LTP,
            "P&L": PnL.toFixed(2),
            change: change.toFixed(2) + "%",
          } as Record<string, string | number>,
        };
      });
      return res;
    }
  }, [ordersQuery, Livestream]);
  // useEffect(() => console.log(dataList), [dataList]);

  const { WSsendOrder } = useContext(BackndWSContext);

  const closeOrderApi = api.Order.cancelTrade.useMutation({
    onSuccess(data, variables, context) {
      console.log(data, variables, context);
      WSsendOrder("order", data);
    },
    onSettled() {
      APIutils.Order.getRemainingFilledOrders
        .invalidate()
        .catch((err) => console.log(err));
      APIutils.Order.getOrders.invalidate().catch((err) => console.log(err));
    },
  });
  const options = useRef({
    colorIndex: ["P&L", "change", "Quantity"],
    selectedAction: (orderid: number[]) => {
      closeOrderApi.mutate({
        orderids: orderid,
      });
    },
  });
  const toast = useToast();

  if (Array.isArray(dataList)) {
    return (
      <div className="flex h-full w-full flex-col bg-white">
        <div className="w-full ">
          <div className="flex w-full p-2">
            <span className="text-textDark grow text-[1.125rem]">
              Open Trades ({dataList.length})
            </span>
          </div>
          <div className="flex w-full items-center justify-center">
            <table className={position_stylesList.table}>
              <thead className={position_stylesList.head}>
                <tr>
                  {headings.map((value) => {
                    return <th key={"heading" + value}>{value}</th>;
                  })}
                </tr>
              </thead>
              <tbody className={position_stylesList.body}>
                {dataList.map((valueList, index) => {
                  return (
                    <tr className="hover:bg-[#f9f9f9]" key={valueList.id}>
                      {headings.map((key, index) => {
                        return (
                          <td
                            className={
                              " " +
                              (options.current.colorIndex.includes(key)
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
              {dataList.length ? (
                <tfoot className="bg-[#f9f9f9] text-center">
                  <tr>
                    <td colSpan={3}></td>
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
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </div>
      </div>
    );
  } else return <>{JSON.stringify(ordersQuery)} Loading...</>;
}

export default Positions;
