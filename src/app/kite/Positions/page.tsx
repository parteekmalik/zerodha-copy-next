"use client";
import { useContext, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { twMerge } from "tailwind-merge";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { updateSeprateSubscriptions } from "~/components/zerodha/_redux/Slices/BinanceWSStats";
import { AppDispatch } from "~/components/zerodha/_redux/store";
import {
  GridColDef,
  PositionRow,
  TableDefaultstyles,
} from "~/components/zerodha/Table/defaultStylexAndTypes";
import DataGrid from "~/components/zerodha/Table/table";
import { sumByKey } from "~/lib/zerodha/utils";
import { api } from "~/trpc/react";
import { getColor, modifyNumber } from "../utils";
import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import {
  FormSchema,
  TFormSchema,
} from "~/components/zerodha/OrderForm/FormSchema";
import { $Enums } from "@prisma/client";

export default function DefaultComonent() {
  const { Livestream } = useBinanceLiveData();

  const Positions = api.Order.getRemainingFilledOrders.useQuery().data;
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (Positions)
      dispatch(
        updateSeprateSubscriptions({
          name: "positions",
          subsription: Positions.map((i) => i.name).filter(
            (i) => i.toLowerCase() !== "usdt",
          ),
        }),
      );
    return () => {
      dispatch(
        updateSeprateSubscriptions({
          name: "positions",
          subsription: [],
        }),
      );
    };
  }, [Positions]);
  const toast = useToast();
  const APIutils = api.useUtils();
  const { WSsendOrder } = useContext(BackndWSContext);

  const OrdersAPI = api.Order.createOrder.useMutation({
    onSuccess: (messages) => {
      messages.map((msg) => {
        if (msg && toast) {
          console.log("mutation nsucess -> ", msg);
          if (typeof msg === "string") {
            toast.open({
              state: "error",
              errorMessage: msg,
            });
          } else {
            toast.open({
              name: msg.name,
              state:
                msg.status === "OPEN"
                  ? "placed"
                  : msg.status === "COMPLETED" || msg.status === "CANCELLED"
                    ? "sucess"
                    : "error",
              quantity: msg.quantity,
              orderId: msg.id,
              type: msg.type,
            });
            WSsendOrder("order", msg);
          }
        }
      });
    },
    onSettled() {
      APIutils.Order.getOrders.refetch().catch((err) => console.log(err));
      APIutils.Order.getRemainingFilledOrders
        .refetch()
        .catch((err) => console.log(err));
      APIutils.getAccountInfo.getAllBalance
        .refetch()
        .catch((err) => console.log(err));
    },
  });

  const PositionsList = (Positions ?? []).map((item) => {
    const {
      id,
      PositionDetails: { quantity, avgPrice, totalPrice },
    } = item;
    const name = item.Orders[0]?.name ?? "error";
    const LTP = Livestream[name]?.curPrice;
    const PL = modifyNumber((Number(LTP) - avgPrice) * quantity, 2, true);
    const change = modifyNumber(Number(LTP) / avgPrice - 1, 2);
    return { id, name, quantity, avgPrice, totalPrice, LTP, "P&L": PL, change };
  });
  const PositionsGridColumn: GridColDef<(typeof PositionsList)[0]>[] = [
    // { headerName: "Product", field: "id", width: 0 },
    { headerName: "Instrument", field: "name", width: 0 },
    { headerName: "Qty.", field: "quantity", width: 0 },
    { headerName: "Avg.", field: "avgPrice", width: 0 },
    { headerName: "LTP", field: "LTP", width: 0 },
    { headerName: "P&L", field: "P&L", width: 0 },
    { headerName: "Change", field: "change", width: 0 },
  ];
  const PositionsTotal = useMemo(
    () => ({ "P&L": sumByKey(PositionsList, "P&L"), LTP: "TOTAL", skip: 3 }),
    [PositionsList],
  );

  const handleFn = (items: PositionRow[]) => {
    // Placeholder function for handling selection
    const orders = items.map((position) => {
      const data = {
        orderType: Number(position.quantity) ? "SELL" : "BUY",
        quantity: Number(position.quantity) ,
        trigerType: "MARKET",
        price: 0,
        symbolName: position.name,
        marketType: "SPOT",
      };
      console.log(data);
      return FormSchema.parse(data);
    });
    OrdersAPI.mutate(orders);
  };

  const positiveAndColor = (value: unknown, styles: string) => {
    const newValue = Number(value);
    const result: [string, string] = [
      modifyNumber(newValue, 2),
      twMerge(styles, getColor(newValue)),
    ];
    return result;
  };
  if (!PositionsList) return null;
  return (
    <div className="dark p-4">
      <div className="flex py-2">
        <h1 className="text-xl opacity-80">
          Positions({Positions ? Positions.length : 0})
        </h1>
      </div>
      <DataGrid<PositionRow>
        rows={PositionsList}
        columns={PositionsGridColumn}
        coloredCols={[
          { name: "P&L", fn: positiveAndColor },
          { name: "quantity", fn: positiveAndColor },
          { name: "change", fn: positiveAndColor },
        ]}
        selected={{ handleFn, text: "close Orders" }}
        footer={PositionsTotal}
        styles={TableDefaultstyles}
      />
    </div>
  );
}
