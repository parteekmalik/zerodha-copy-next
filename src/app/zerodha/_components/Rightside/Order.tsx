import { $Enums } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";
import DataContextComponent from "../../_contexts/data/dataContextComponent";
import DataContext from "../../_contexts/data/data";
import BackndWSContext from "../../_contexts/backendWS/backendWS";
export type TOrder = {
  id: string;
  createdAt: Date;
  name: string;
  type: $Enums.OrderType;
  price: number;
  quantity: number;
  status: $Enums.OrderStatus;
  triggerType: $Enums.EtriggerType;
  sl: number;
  tp: number;
  TradingAccountId: string;
};
export const stylesList = {
  padding: " p-[10px_12px] ",
  table: "m-2 w-full",
  head: "border-b-2 text-[.75rem]  text-[#9b9b9b]",
  body: "text-center text-[14px] text-[#444444]",
  row: ["", "", "", "", "", "", " border-r ", ""],
};
function Order() {
  const queryClient = useQueryClient(); // Initialize queryClient
  const { data: orders, isLoading } = api.orders.getOrders.useQuery();
  const [openOrders, setopenOrders] = useState<TOrder[]>([]);
  const [executedOrders, setexecutedOrders] = useState<TOrder[]>([]);
  const { WSsendOrder } = useContext(BackndWSContext);

  useEffect(() => {
    console.log("orders updated ->", orders);
    if (typeof orders !== "string" && orders !== undefined) {
      setopenOrders(orders.filter((item) => item.status === "open"));
      setexecutedOrders(orders.filter((item) => item.status !== "open"));
    }
  }, [orders]);
  if (typeof orders === "string") return <>{orders}</>;
  const cancelOrderApi = api.orders.cancelOrders.useMutation({
    onSuccess(data, variables, context) {
      console.log(data, variables, context);
      queryClient.refetchQueries().catch((err) => console.log(err));
      WSsendOrder("deleteOrder", variables);
    },
  });
  function selectedAction(orderids: string[]) {
    cancelOrderApi.mutate(orderids);
  }

  return (
    <div className="flex  w-full flex-col bg-white">
      {openOrders.length ? (
        <div className="flex w-full flex-col ">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Open orders ({openOrders?.length})
            </span>
            <input className="w-[50px]" value={"search"}></input>
          </div>
          <Table
            headings={[
              "Time",
              "Type",
              "Instrument",
              "Product",
              "Quantity",
              "LTP",
              "Price",
              "Status",
            ]}
            stylesList={stylesList}
            dataList={openOrders.map((item) => {
              return {
                id: item.id,
                data: [
                  item.createdAt.toTimeString().split(" ")[0] ?? "",
                  item.type,
                  item.name,
                  "SPOT",
                  `${0}/${item.quantity}`,
                  "LTP",
                  item.price,
                  item.status,
                ],
              };
            })}
            options={{ selectedAction }}
          />
        </div>
      ) : null}
      {executedOrders.length ? (
        <div className="flex w-full flex-col">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Executed orders ({executedOrders?.length})
            </span>
          </div>
          <Table
            headings={[
              "Time",
              "Type",
              "Instrument",
              "Product",
              "Quantity",
              "LTP",
              "Price",
              "Status",
            ]}
            stylesList={stylesList}
            dataList={executedOrders.map((item) => {
              return {
                id: item.id,
                data: [
                  item.createdAt.toTimeString().split(" ")[0] ?? "",
                  item.type,
                  item.name,
                  "SPOT",
                  `${item.quantity}/${item.quantity}`,
                  "LTP",
                  item.price,
                  item.status,
                ],
              };
            })}
            options={{}}
          />
        </div>
      ) : null}

      {/* <div>{JSON.stringify(orders)}</div> */}
    </div>
  );
}
export function Table({
  headings,
  stylesList,
  dataList,
  options,
}: {
  headings: string[];
  stylesList: {
    row: string[];
    table: string;
    head: string;
    body: string;
    padding: string;
  };
  dataList: { id: string; data: (string | number)[] }[];
  options: { selectedAction?: (orderids: string[]) => void };
}) {
  const [selected, setSelected] = useState<boolean[]>([]);
  const [selectedCount, setselectedCount] = useState(0);
  useEffect(() => {
    console.log("selected table", selected);
    setselectedCount(
      selected.reduce((prev, curr, currIndex) => {
        if (curr === true) prev++;
        return prev;
      }, 0),
    );
  }, [selected]);
  useEffect(() => {
    console.log("selectedCount", selectedCount);
  }, [selectedCount]);
  return (
    <table className={stylesList.table}>
      <thead className={stylesList.head}>
        <tr>
          {options.selectedAction && <th>checkbox</th>}
          {headings.map((item, i) => {
            return (
              <th
                key={JSON.stringify(item) + i}
                className={
                  stylesList.padding + stylesList.row[i] + " hover:bg-[#f9f9f9]"
                }
              >
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={stylesList.body}>
        {dataList?.map((items, i) => {
          return (
            <tr key={JSON.stringify(items) + i} className="hover:bg-[#f9f9f9]">
              {options.selectedAction && (
                <td className={stylesList.padding}>
                  <input
                    key={"checkbox" + items.id}
                    type="checkbox"
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setSelected((prev) => {
                        prev[i] = e.target.checked;
                        return [...prev];
                      });
                    }}
                  />
                </td>
              )}
              {items.data.map((item, i) => {
                return (
                  <td
                    // using random for key
                    key={JSON.stringify(item) + i}
                    className={stylesList.padding + stylesList.row[i]}
                  >
                    {item}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        {selectedCount > 0 ? (
          <tr className={" hover:bg-[#f9f9f9]"}>
            <td colSpan={3} className={stylesList.padding + " text-[.75rem]"}>
              <button
                className="rounded bg-[#4184f3] p-[7px_12px] text-white"
                onClick={() => {
                  const list = selected.reduce((prev: string[], cur, i) => {
                    if (cur) {
                      const temp = dataList[i]?.id;
                      if (temp) prev.push(temp);
                    }
                    return prev;
                  }, []);
                  if (options.selectedAction) options.selectedAction(list);
                }}
              >
                Cancel {selectedCount} order
              </button>
            </td>
            <td colSpan={6}></td>
          </tr>
        ) : null}
      </tfoot>
    </table>
  );
}

export default Order;
