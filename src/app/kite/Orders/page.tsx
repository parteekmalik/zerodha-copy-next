"use client";
import { $Enums } from "@prisma/client";
import { ReactNode, useMemo } from "react";
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

  const handleFn = (items: OrderOpenRow[]) => {
    // Placeholder function for handling selection
    console.log("submitted: ", items);
  };

  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col p-4">
      <div className="flex w-full py-2">
        <span className="grow text-lg text-textDark">
          Open Trades ({openOrders.length})
        </span>
      </div>
      <DataGrid<OrderOpenRow>
        rows={openOrders}
        columns={openOrdersColumn}
        coloredCols={colorColsData as coloredColsType<OrderOpenRow>}
        selected={{handleFn , text:"cancel Orders"}}
        styles={TableDefaultstyles}
      />
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
      const restult: [ReactNode, string] = [
        <FadedColoredCell
          text={orderType}
          bgColor={orderType === "BUY" ? "bg-blueApp " : "bg-redApp "}
          textColor={orderType === "BUY" ? "text-blueApp " : "text-redApp "}
        />,
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
        <FadedColoredCell
          text={orderType}
          bgColor={
            orderType === "COMPLETED" ? "bg-greenApp " : "bg-darkGrayApp "
          }
          textColor={
            orderType === "COMPLETED" ? "text-greenApp " : "text-black "
          }
        />,
        twMerge(styles, ""),
      ];
      return restult;
    },
  },
];
