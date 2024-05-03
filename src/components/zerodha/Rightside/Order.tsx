import { $Enums } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo, useRef } from "react";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { api } from "~/trpc/react";
import Table from "./Table/table";
import { useSelector } from "react-redux";
import { RootState } from "../_redux/store";

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
const stylesList = {
  padding: " p-[10px_12px] ",
  table: "m-2 w-full",
  head: "border-b-2 text-[.75rem]  text-[#9b9b9b]",
  body: "text-center text-[14px] text-[#444444]",
  row: { Price: " border-r " },
};
const headings = ["Time", "Type", "Instrument", "Quantity", "Price", "Status"];
function Order() {
  const queryClient = useQueryClient(); // Initialize queryClient
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );
  const { data: orders, isLoading } =
    api.orders.getOrders.useQuery(TradingAccountId);
  const { WSsendOrder } = useContext(BackndWSContext);

  if (typeof orders === "string") return <>{orders}</>;
  const cancelOrderApi = api.orders.cancelOrders.useMutation({
    onSuccess(data, variables, context) {
      console.log(data, variables, context);
      queryClient.refetchQueries().catch((err) => console.log(err));
      WSsendOrder("deleteOrder", variables);
    },
  });
  const options = useRef({
    open: {
      selectedAction: (orderids: string[]) => {
        cancelOrderApi.mutate({ Taccounts: TradingAccountId, orderids });
      },
    },
    close: {
      colorIndex: ["Status"],
    },
  });

  const dataList = useMemo(() => {
    if (orders !== undefined && typeof orders !== "string") {
      const openOrders = orders.filter((item) => item.status === "open");
      const executedOrders = orders.filter((item) => item.status !== "open");
      return {
        open: openOrders.map((item) => {
          return {
            id: item.id,
            data: {
              Time: item.createdAt.toTimeString().split(" ")[0] ?? "",
              Type: item.type,
              Instrument: item.name,
              Quantity: `${0}/${item.quantity}`,
              Price: item.price,
              Status: item.status,
            },
          };
        }),
        close: executedOrders.map((item) => {
          return {
            id: item.id,
            data: {
              Time: item.createdAt.toTimeString().split(" ")[0] ?? "",
              Type: item.type,
              Instrument: item.name,
              Product: "SPOT",
              Quantity: `${item.quantity}/${item.quantity}`,
              Price: item.price,
              Status: item.status,
            },
          };
        }),
      };
    } else return { open: [], close: [] };
  }, [orders]);
  return (
    <div className="flex  h-full w-full flex-col">
      <div className="flex w-full flex-col ">
        <div className="flex w-full p-2">
          <span className="grow text-[1.125rem] text-[#444444]">
            Open orders ({dataList.open.length})
          </span>
          <input className="w-[50px]" value={"search"}></input>
        </div>
        <Table
          headings={headings}
          stylesList={stylesList}
          dataList={dataList.open}
          options={options.current.open}
        />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex w-full p-2">
          <span className="grow text-[1.125rem] text-[#444444]">
            Executed orders ({dataList.close.length})
          </span>
        </div>
        <Table
          headings={headings}
          stylesList={stylesList}
          dataList={dataList.close}
          options={options.current.close}
        />
      </div>
    </div>
  );
}

export default Order;
