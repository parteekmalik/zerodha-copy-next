import { useMemo } from "react";
import { formatDate } from "~/app/v1/utils";
import { api } from "~/trpc/react";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { type Order, type $Enums } from "@prisma/client";

export type TclosedOrder = {
  name: string;
  id: number;
  openedAt: string;
  quantity: string;
  price: number;
  type: $Enums.OrderType;
  status: $Enums.OrderStatus;
  triggerType: $Enums.EtriggerType;
  raw: Order;
};
export type TopenOrder = TclosedOrder & {
  LTP: string | undefined;
};
export default function useOrder(filterFor ?: string) {
  const { Livestream } = useBinanceLiveData();

  const orders = api.Order.getOrders.useQuery().data;
  const filteredOrders = useMemo(() => 
    Array.isArray(orders) ? orders.filter(i => i.name === filterFor || filterFor === null) : [], 
    [orders, filterFor]
  );
  const closedOrders: TclosedOrder[] = useMemo(
    () =>
      typeof filteredOrders === "object"
        ? filteredOrders
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
                raw: it,
              };
            })
        : [],
    [filteredOrders],
  );
  const openOrders: TopenOrder[] = useMemo(
    () =>
      typeof filteredOrders === "object"
        ? filteredOrders
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
                raw: it,
              };
            })
        : [],
    [filteredOrders, Livestream],
  );
  

  return { openOrders, closedOrders, orders: filteredOrders };
}
