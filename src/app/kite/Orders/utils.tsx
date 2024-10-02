import { FadedColoredCell } from "~/components/zerodha/Table/cellStyledComponents";
import { type MobileRowType } from "~/components/zerodha/Table/mobileTable/MobileTable";
import { type TclosedOrder, type TopenOrder } from "./useOrder";

export function useconvertIntoMobileData({ openOrders, closedOrders }: { openOrders: TopenOrder[]; closedOrders: TclosedOrder[] }) {
  const openOrderMobile: MobileRowType = openOrders.map((order) => {
    return {
      raw: order.raw,
      content: [
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
      ],
    };
  });
  const closedOrderMobile: MobileRowType = closedOrders.map((order) => {
    return {
      raw: order.raw,
      content: [
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
      ],
    };
  });
  return { closedOrderMobile, openOrderMobile };
}
