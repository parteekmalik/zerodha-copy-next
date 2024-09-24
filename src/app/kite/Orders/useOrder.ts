import { useMemo } from "react";
import { GridColDef } from "~/components/zerodha/Table/defaultStylexAndTypes";
import { formatDate } from "../utils";
import { api } from "~/trpc/react";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";

export default function useOrder() {
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
  
  return { openOrders, openOrdersColumn, closedOrders, closedOrdersColumn,orders };
}
