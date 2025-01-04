"use client";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { type $Enums } from "@prisma/client";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import InfoHover from "~/components/ui/infoHover";
import useCancelOrders from "~/components/zerodha/_hooks/API/usecancelOrders";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import { FadedColoredCell } from "~/components/zerodha/Table/cellStyledComponents";
import { type coloredColsType, type OrderClosedRow, type OrderOpenRow, TableDefaultstyles } from "~/components/zerodha/Table/defaultStylexAndTypes";
import MobileTable from "~/components/zerodha/Table/mobileTable/MobileTable";
import OrderOptionsList from "~/components/zerodha/Table/OrderOptions";
import DataGrid from "~/components/zerodha/Table/table";
import useOrder from "./useOrder";
import { useconvertIntoMobileData } from "./utils";

function OrderPage() {
  const { closedOrders, closedOrdersColumn, openOrders, openOrdersColumn, orders } = useOrder();
  const { cancelOrdersAPI } = useCancelOrders();

  const handleFn = (items: OrderOpenRow[]) => {
    // Placeholder function for handling selection
    const orderids = items.map((it) => it.id);
    cancelOrdersAPI.mutate({ orderids });
  };

  const { closedOrderMobile, openOrderMobile } = useconvertIntoMobileData({ openOrders, closedOrders });
  const { isDeviceCompatible } = useDeviceType();

  return typeof orders === "string" || orders === undefined ? (
    <div>{orders}</div>
  ) : (
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
              coloredCols={colorColsDataOpen}
              selected={{ handleFn, text: "cancel Orders" }}
              styles={TableDefaultstyles}
            />
          ) : (
            <MobileTable orders={openOrderMobile} options={{ Cancel: true, Modify: true }} />
          )}
        </>
      ) : null}
      <div className="flex w-full py-2">
        <span className="grow text-lg text-textDark">Executed Trades ({closedOrders.length})</span>
      </div>
      {isDeviceCompatible("lg") ? (
        <DataGrid<OrderClosedRow> rows={closedOrders} coloredCols={colorColsDataClosed} columns={closedOrdersColumn} styles={TableDefaultstyles} />
      ) : (
        <MobileTable orders={closedOrderMobile} />
      )}
    </div>
  );
}

export default OrderPage;
const colorColsDataClosed: coloredColsType<OrderClosedRow> = [
  {
    name: "type",
    fn: (row: OrderClosedRow, key: keyof OrderClosedRow, styles: string) => {
      const orderType = row[key] as $Enums.OrderType;
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
    fn: (row: OrderClosedRow, key: keyof OrderClosedRow, styles: string) => {
      const orderType = row[key] as $Enums.OrderStatus;
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
const colorColsDataOpen: coloredColsType<OrderOpenRow> = [
  ...(colorColsDataClosed as coloredColsType<OrderOpenRow>),
  {
    name: "openedAt",
    fn: (row: OrderOpenRow, key: keyof OrderOpenRow, styles: string) => {
      const openedAt = row[key] as string;
      const component = (
        <>
          <span className="">{openedAt}</span>
          <InfoHover
            options={{ isClickEnabled: true }}
            info={
              <div className="invisible hover:cursor-pointer group-hover:visible ">
                <MoreHorizIcon />
              </div>
            }
          >
            <OrderOptionsList options={{ Add: true, Close: true, Cancel: true }} order={row} />
          </InfoHover>
        </>
      );
      const restult: [ReactNode, string] = [component, twMerge(styles, "flex flex-row gap-2 justify-center")];
      return restult;
    },
  },
];
