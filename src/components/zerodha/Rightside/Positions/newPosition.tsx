import { useContext, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { api } from "~/trpc/react";
import BackndWSContext from "../../_contexts/backendWS/backendWS";
import { RootState } from "../../_redux/store";
import Pending, { Cell } from "./Pending";

import { sumByKey } from "~/lib/zerodha/utils";
import { useToast } from "../../_contexts/Toast/toast-context";
import { getColor } from "../../WatchList/drag_drop_wishlist/Item";

const headings = [
  "Instrument",
  "Quantity",
  "Price",
  "SL",
  "TP",
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

function Positions() {
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );
  const ordersQuery = api.Trades.getFilledTrades.useQuery(TradingAccountId);
  const APIutils = api.useUtils();

  const Livestream = useSelector((state: RootState) => state.Livestream);

  const dataList = useMemo(() => {
    if (typeof ordersQuery.data !== "object") return ordersQuery.data;
    else {
      const res = ordersQuery.data.map((value) => {
        const LTP = Livestream[value.name]?.curPrice ?? 0;
        const PnL = LTP === 0 ? 0 : (LTP - value.openPrice) * value.quantity;
        const change = LTP === 0 ? 0 : (LTP / value.openPrice) * 100 - 100;

        return {
          id: value.id,
          data: {
            Instrument: value.name,
            Quantity: value.quantity,
            Price: value.openPrice,
            LTP,
            SL: value.sl,
            TP: value.tp,
            "P&L": PnL.toFixed(2),
            change: change.toFixed(2) + "%",
          } as Record<string, string | number>,
        };
      });
      return res;
    }
  }, [ordersQuery.data, Livestream]);

  const { WSsendOrder } = useContext(BackndWSContext);

  const closeOrderApi = api.Trades.closeOrders.useMutation({
    onSuccess(data, variables, context) {
      console.log(data, variables, context);
      WSsendOrder("deleteOrder", variables);
    },
    onSettled() {
      APIutils.Trades.getFilledTrades
        .invalidate()
        .catch((err) => console.log(err));
    },
  });
  const options = useRef({
    colorIndex: ["P&L", "change", "Quantity"],
    selectedAction: (orderid: string | number) => {
      closeOrderApi.mutate({
        Taccounts: TradingAccountId,
        orderids: orderid,
      });
    },
    updateTP_SL: (
      orderid: string | number,
      value: number,
      type: "tp" | "sl",
    ) => {
      updateTP_SL_Api.mutate({
        Taccounts: TradingAccountId,
        orderids: orderid,
        value,
        type,
      });
    },
  });
  const toast = useToast();

  const updateTP_SL_Api = api.Trades.updateTP_SL.useMutation({
    onSuccess(data, variables, context) {
      console.log(data, variables, context);

      if (typeof data === "string")
        toast?.open({ state: "error", errorMessage: data });
      else
        toast?.open({
          name: data.name,
          state: "update",
          orderId: data.id,
          type: "BUY",
          quantity: data.quantity,
        });
    },
    onSettled() {
      APIutils.Trades.getPendingTrades
        .invalidate()
        .catch((err) => console.log(err));
      APIutils.Trades.getFilledTrades
        .invalidate()
        .catch((err) => console.log(err));
    },
  });
  if (Array.isArray(dataList)) {
    return (
      <div className="flex h-full w-full flex-col bg-white">
        <div className="w-full ">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
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
                  <th>close</th>
                </tr>
              </thead>
              <tbody className={position_stylesList.body}>
                {dataList.map((valueList, index) => {
                  return (
                    <tr className="hover:bg-[#f9f9f9]" key={valueList.id}>
                      {headings.map((key, index) => {
                        return (
                          <Cell
                            className={
                              " " +
                              (options.current.colorIndex.includes(key)
                                ? getColor(valueList.data[key] ?? 0)
                                : " ")
                            }
                            updateTP_SL={options.current.updateTP_SL}
                            Key={key}
                            valueList={valueList}
                            key={valueList.id + key}
                          />
                        );
                      })}
                      <td>
                        <button
                          onClick={() =>
                            options.current.selectedAction(valueList.id)
                          }
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {dataList.length ? (
                <tfoot className="text-center">
                  <tr>
                    <td colSpan={5}></td>
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
                    <td>
                      <button
                        onClick={() => {
                          dataList.map((i) =>
                            options.current.selectedAction(i.id),
                          );
                        }}
                      >
                        x
                      </button>
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </div>
        <Pending updateTP_SL={options.current.updateTP_SL} />
        <div className="grow"></div>
      </div>
    );
  } else return <>{JSON.stringify(ordersQuery.data)} Loading...</>;
}

export default Positions;
