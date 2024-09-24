"use client";
import { $Enums } from "@prisma/client";
import { ReactNode, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { usecancelOrders } from "~/components/zerodha/_hooks/API/usecancelOrders";
import { FadedColoredCell } from "~/components/zerodha/Table/cellStyledComponents";
import {
  coloredColsType,
  GridColDef,
  OrderClosedRow,
  OrderOpenRow,
  TableDefaultstyles,
} from "~/components/zerodha/Table/defaultStylexAndTypes";
import MobileTable, { MobileRowType } from "~/components/zerodha/Table/mobileTable/MobileTable";
import DataGrid from "~/components/zerodha/Table/table";
import { api } from "~/trpc/react";
import { formatDate } from "../utils";

function OrderPage() {
  const { Livestream } = useBinanceLiveData();

  const orders = api.Order.getOrders.useQuery().data;
  const closedOrders = useMemo(
    () =>
      typeof orders === "object"
        ? orders
            .filter((i) => i.status !== "OPEN")
            .map((it) => {
              const { name, id, openedAt, quantity, price, type, status, triggerType } = it;
              return {
                name,
                id,
                openedAt: formatDate(openedAt),
                quantity: quantity + "/" + quantity,
                price,
                type,
                status,
                triggerType,
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
              const { name, id, openedAt, quantity, price, type, status, triggerType } = it;
              return {
                name,
                id,
                openedAt: formatDate(openedAt),
                LTP: Livestream[name]?.curPrice,
                quantity: "0/" + quantity,
                price,
                type,
                status,
                triggerType,
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
  const { cancelOrdersAPI } = usecancelOrders();

  const handleFn = (items: OrderOpenRow[]) => {
    // Placeholder function for handling selection
    const orderids = items.map((it) => it.id);
    cancelOrdersAPI.mutate({ orderids });
  };
  const openOrderMobile = openOrders.map((order) => {
    return [
      {
        first: [
          <FadedColoredCell
            key={"quantity"}
            parentStyle="px-1"
            text={order.type}
            bgColor={order.type === "BUY" ? "bg-blueApp " : "bg-redApp "}
            textColor={order.type === "BUY" ? "text-blueApp " : "text-redApp "}
          />,
          order.quantity,
        ],
        second: [
          order.openedAt.split(" ")[1],
          <FadedColoredCell
            key={"status"}
            parentStyle="px-1"
            text={order.status}
            bgColor={order.status === "COMPLETED" ? "bg-greenApp " : "bg-foreground "}
            textColor={order.status === "COMPLETED" ? "text-greenApp " : "text-foreground "}
          />,
        ],
      },
      { first: [order.name], second: [order.price] },
      { first: ["SPOT", order.triggerType], second: ["LTP " + order.LTP] },
    ];
  });
  const closedOrderMobile = closedOrders.map((order) => {
    return [
      {
        first: [
          <FadedColoredCell
            key={"quantity"}
            parentStyle="px-1"
            text={order.type}
            bgColor={order.type === "BUY" ? "bg-blueApp " : "bg-redApp "}
            textColor={order.type === "BUY" ? "text-blueApp " : "text-redApp "}
          />,
          order.quantity,
        ],
        second: [
          order.openedAt.split(" ")[1],
          <FadedColoredCell
            key={"status"}
            parentStyle="px-1"
            text={order.status}
            bgColor={order.status === "COMPLETED" ? "bg-greenApp " : "bg-foreground "}
            textColor={order.status === "COMPLETED" ? "text-greenApp " : "text-foreground "}
          />,
        ],
      },
      { first: [order.name], second: [order.price] },
      { first: ["SPOT"], second: [order.triggerType] },
    ];
  });

  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col p-4">
      {openOrders.length ? (
        <>
          <div className="flex w-full py-2">
            <span className="grow text-lg text-textDark">Open Trades ({openOrders.length})</span>
          </div>
          <div className="hidden lg:block">
            <DataGrid<OrderOpenRow>
              rows={openOrders}
              columns={openOrdersColumn}
              coloredCols={colorColsData as coloredColsType<OrderOpenRow>}
              selected={{ handleFn, text: "cancel Orders" }}
              styles={TableDefaultstyles}
            />
          </div>
          <MobileTable orders={openOrderMobile as MobileRowType} />
        </>
      ) : null}
      <div className="flex w-full py-2">
        <span className="grow text-lg text-textDark">Executed Trades ({closedOrders.length})</span>
      </div>
      <div className="hidden lg:block">
        <DataGrid<OrderClosedRow>
          rows={closedOrders}
          columns={closedOrdersColumn}
          coloredCols={colorColsData as coloredColsType<OrderClosedRow>}
          styles={TableDefaultstyles}
        />
      </div>
      <MobileTable orders={closedOrderMobile as MobileRowType} />
    </div>
  );
}

export default OrderPage;
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
      const restult: [ReactNode, string] = [component, twMerge(styles)];
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
          bgColor={orderType === "COMPLETED" ? "bg-greenApp " : "bg-foreground "}
          textColor={orderType === "COMPLETED" ? "text-greenApp " : "text-foreground "}
        />
      );
      const restult: [ReactNode, string] = [component, twMerge(styles, "")];
      return restult;
    },
  },
];
