"use client";
import { $Enums } from "@prisma/client";
import { ReactNode, useContext, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { FadedColoredCell } from "~/components/zerodha/Table/cellStyledComponents";
import {
  coloredColsType,
  GridColDef,
  OrderClosedRow,
  OrderOpenRow,
  TableDefaultstyles,
} from "~/components/zerodha/Table/defaultStylexAndTypes";
import DataGrid from "~/components/zerodha/Table/table";
import { api } from "~/trpc/react";
import { formatDate } from "../utils";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";

function Order() {
  const { Livestream } = useBinanceLiveData();

  const orders = api.Order.getOrders.useQuery().data;
  const closedOrders = useMemo(
    () =>
      typeof orders === "object"
        ? orders
            .filter((i) => i.status !== "OPEN")
            .map((it) => {
              const { name, id, openedAt, quantity, price, type, status } = it;
              return {
                name,
                id,
                openedAt: formatDate(openedAt),
                quantity: quantity + "/" + quantity,
                price,
                type,
                status,
              };
            })
        : [],
    [orders],
  );
  const openOrders = useMemo(
    () =>
      typeof orders === "object"
        ? orders
            .filter((i) => i.status === "OPEN")
            .map((it) => {
              const { name, id, openedAt, quantity, price, type, status } = it;
              return {
                name,
                id,
                openedAt: formatDate(openedAt),
                LTP: Livestream[name]?.curPrice,
                quantity: "0/" + quantity,
                price,
                type,
                status,
              };
            })
        : [],
    [orders, Livestream],
  );
  const openOrdersColumn: GridColDef<(typeof openOrders)[0]>[] = [
    { headerName: "openedAt", field: "openedAt", width: 0 },
    { headerName: "type", field: "type", width: 0 },
    { headerName: "name", field: "name", width: 0 },
    { headerName: "quantity", field: "quantity", width: 0 },
    { headerName: "LTP", field: "LTP", width: 0 },
    { headerName: "price", field: "price", width: 0 },
    { headerName: "status", field: "status", width: 0 },
  ];
  const closedOrdersColumn: GridColDef<(typeof closedOrders)[0]>[] = [
    { headerName: "openedAt", field: "openedAt", width: 0 },
    { headerName: "type", field: "type", width: 0 },
    { headerName: "name", field: "name", width: 0 },
    { headerName: "quantity", field: "quantity", width: 0 },
    { headerName: "price", field: "price", width: 0 },
    { headerName: "status", field: "status", width: 0 },
  ];
  const APIutils = api.useUtils();
  const { WSsendOrder } = useContext(BackndWSContext);
  const toast = useToast();

  const cancelOrdersAPI = api.Order.cancelTrade.useMutation({
    onSuccess(messages) {
      messages.map((message) => {
        console.log("mutation nsucess -> ", message);
        if (typeof message === "string") {
          toast.open({
            state: "error",
            errorMessage: message,
          });
        } else {
          toast.open({
            name: message.name,
            state:
              message.status === "OPEN"
                ? "placed"
                : message.status === "COMPLETED" ||
                    message.status === "CANCELLED"
                  ? "sucess"
                  : "error",
            quantity: message.quantity,
            orderId: message.id,
            type: message.type,
          });
          WSsendOrder("order", message);
        }
      });
    },
    onSettled() {
      APIutils.Order.getOrders.refetch().catch((err) => console.log(err));
      APIutils.getAccountInfo.getAllBalance
        .refetch()
        .catch((err) => console.log(err));
    },
  });

  const handleFn = (items: OrderOpenRow[]) => {
    // Placeholder function for handling selection
    const orderids = items.map((it) => it.id);
    cancelOrdersAPI.mutate({ orderids });
  };

  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col p-4">
      {openOrders.length ? (
        <>
          <div className="flex w-full py-2">
            <span className="grow text-lg text-textDark">
              Open Trades ({openOrders.length})
            </span>
          </div>
          <DataGrid<OrderOpenRow>
            rows={openOrders}
            columns={openOrdersColumn}
            coloredCols={colorColsData as coloredColsType<OrderOpenRow>}
            selected={{ handleFn, text: "cancel Orders" }}
            styles={TableDefaultstyles}
          />
        </>
      ) : null}
      <div className="flex w-full py-2">
        <span className="grow text-lg text-textDark">
          Executed Trades ({closedOrders.length})
        </span>
      </div>
      <DataGrid<OrderClosedRow>
        rows={closedOrders}
        columns={closedOrdersColumn}
        coloredCols={colorColsData as coloredColsType<OrderClosedRow>}
        styles={TableDefaultstyles}
      />
    </div>
  );
}

export default Order;
const colorColsData = [
  {
    name: "type",
    fn: (value: unknown, styles: string) => {
      const orderType = value as $Enums.OrderType;
      const component = (
        <FadedColoredCell
          text={orderType}
          bgColor={orderType === "BUY" ? "bg-blueApp " : "bg-redApp "}
          textColor={orderType === "BUY" ? "text-blueApp " : "text-redApp "}
        />
      );
      const restult: [ReactNode, string] = [component, twMerge(styles, "")];
      return restult;
    },
  },
  {
    name: "status",
    fn: (value: unknown, styles: string) => {
      const orderType = value as $Enums.OrderStatus;
      const component = (
        <FadedColoredCell
          text={orderType}
          bgColor={
            orderType === "COMPLETED" ? "bg-greenApp " : "bg-foreground "
          }
          textColor={
            orderType === "COMPLETED" ? "text-greenApp " : "text-foreground "
          }
        />
      );
      const restult: [ReactNode, string] = [component, twMerge(styles, "")];
      return restult;
    },
  },
];
