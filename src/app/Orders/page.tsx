"use client";
import { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/components/zerodha/_redux/store";
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
import { $Enums } from "@prisma/client";
import { twMerge } from "tailwind-merge";

function Order() {
  const Livestream = useSelector((state: RootState) => state.Livestream);

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

  const handleFn = (ids: (string | number)[]) => {
    // Placeholder function for handling selection
    console.log("submitted: ", ids);
  };

  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col p-4">
      <div className="flex w-full py-2">
        <span className="text-textDark grow text-lg">
          Open Trades ({openOrders.length})
        </span>
      </div>
      <DataGrid<OrderOpenRow>
        rows={openOrders}
        columns={openOrdersColumn}
        coloredCols={colorColsData as coloredColsType<OrderOpenRow>}
        selected={handleFn}
        styles={TableDefaultstyles}
      />
      <div className="flex w-full py-2">
        <span className="text-textDark grow text-lg">
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
      const restult: [ReactNode, string] = [
        <div key={"hi"} className={twMerge("relative  m-auto")}>
          <div
            className={twMerge(
              "absolute left-0 top-0 h-full w-full rounded-sm opacity-30  ",
              orderType === "BUY" ? "bg-blueApp " : "bg-redApp ",
            )}
          ></div>
          <span
            className={orderType === "BUY" ? "text-blueApp " : "text-redApp "}
          >
            {orderType}
          </span>
        </div>,
        twMerge(styles, ""),
      ];
      return restult;
    },
  },
  {
    name: "status",
    fn: (value: unknown, styles: string) => {
      const orderType = value as $Enums.OrderStatus;
      const restult: [ReactNode, string] = [
        <div key={"hi"} className={twMerge("relative  m-auto")}>
          <div
            className={twMerge(
              "absolute left-0 top-0 h-full w-full rounded-sm opacity-30  ",
              orderType === "COMPLETED" ? "bg-greenApp " : "bg-darkGrayApp ",
            )}
          ></div>
          <span
            className={
              orderType === "COMPLETED" ? "text-greenApp " : "text-black "
            }
          >
            {orderType}
          </span>
        </div>,
        twMerge(styles, ""),
      ];
      return restult;
    },
  },
];
