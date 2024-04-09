import { $Enums } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import BackndWSContext from "../../_contexts/backendWS/backendWS";
import Table from "./Table/table";
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
          {/* <Table
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
          /> */}
        </div>
      ) : null}
      {executedOrders.length ? (
        <div className="flex w-full flex-col">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Executed orders ({executedOrders?.length})
            </span>
          </div>
          {/* <Table
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
          /> */}
        </div>
      ) : null}

      {/* <div>{JSON.stringify(orders)}</div> */}
    </div>
  );
}


export default Order;
