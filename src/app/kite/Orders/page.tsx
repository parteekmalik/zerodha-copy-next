"use client";
import { type $Enums } from "@prisma/client";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import useCancelOrders from "~/components/zerodha/_hooks/API/usecancelOrders";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import { FadedColoredCell } from "~/components/zerodha/Table/cellStyledComponents";
import {
  type coloredColsType,
  type OrderClosedRow,
  type OrderOpenRow,
  TableDefaultstyles,
} from "~/components/zerodha/Table/defaultStylexAndTypes";
import MobileTable, { type MobileRowType } from "~/components/zerodha/Table/mobileTable/MobileTable";
import DataGrid from "~/components/zerodha/Table/table";
import useOrder, { type TclosedOrder, type TopenOrders } from "./useOrder";

function OrderPage() {
  const { closedOrders, closedOrdersColumn, openOrders, openOrdersColumn, orders } = useOrder();
  const { cancelOrdersAPI } = useCancelOrders();

  const handleFn = (items: OrderOpenRow[]) => {
    // Placeholder function for handling selection
    const orderids = items.map((it) => it.id);
    cancelOrdersAPI.mutate({ orderids });
  };

  const { closedOrderMobile, openOrderMobile } = convertIntoMobileData({ openOrders, closedOrders });
  const { isDeviceCompatible } = useDeviceType();

  if (typeof orders === "string" || orders === undefined) return <>{orders}</>;
  return (
    <div className="flex  h-full w-full flex-col p-4">
      {openOrders.length ? (
        <>
          <div className="flex w-full py-2">
            <span className="grow text-lg text-textDark">Open Trades ({openOrders.length})</span>
          </div>
          {isDeviceCompatible("lg") ? (
            <DataGrid<OrderOpenRow>
              rows={openOrders}
              columns={openOrdersColumn}
              coloredCols={colorColsData as coloredColsType<OrderOpenRow>}
              selected={{ handleFn, text: "cancel Orders" }}
              styles={TableDefaultstyles}
            />
          ) : (
            <MobileTable orders={openOrderMobile as MobileRowType} />
          )}
        </>
      ) : null}
      <div className="flex w-full py-2">
        <span className="grow text-lg text-textDark">Executed Trades ({closedOrders.length})</span>
      </div>
      {isDeviceCompatible("lg") ? (
        <DataGrid<OrderClosedRow>
          rows={closedOrders}
          columns={closedOrdersColumn}
          coloredCols={colorColsData as coloredColsType<OrderClosedRow>}
          styles={TableDefaultstyles}
        />
      ) : (
        <MobileTable orders={closedOrderMobile } />
      )}
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
function convertIntoMobileData({
  openOrders,
  closedOrders,
}: {
  openOrders: TopenOrders[];
  closedOrders: TclosedOrder[];
}) {
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
  return { closedOrderMobile, openOrderMobile };
}
