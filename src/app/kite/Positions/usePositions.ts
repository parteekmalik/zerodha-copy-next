import { useMemo } from "react";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { type GridColDef, type PositionRow } from "~/components/zerodha/Table/defaultStylexAndTypes";
import { sumByKey } from "~/lib/zerodha/utils";
import { api } from "~/trpc/react";
import { modifyNumber } from "../utils";

export type TPositionsList = {
  id: string;
  name: string;
  quantity: string;
  avgPrice: string;
  totalPrice: number;
  LTP: string | undefined;
  "P&L": string;
  change: string;
};
export default function usePositions() {
  const { Livestream } = useBinanceLiveData();
  const Positions = api.Console.getRemainingFilledOrders.useQuery().data;

  const PositionsList = (Positions ?? []).map((item) => {
    const {
      id,
      PositionDetails: { quantity, avgPrice, totalPrice },
    } = item;
    const name = item.Orders[0]?.name ?? "error";
    const LTP = Livestream[name]?.curPrice;
    const PL = modifyNumber((Number(LTP) - avgPrice) * quantity, 2, true);
    const change = modifyNumber(Number(LTP) / avgPrice - 1, 2);
    return {
      id,
      name,
      quantity: modifyNumber(quantity, 2),
      avgPrice: modifyNumber(avgPrice, 3),
      totalPrice,
      LTP,
      "P&L": PL,
      change,
    };
  });
  const PositionsGridColumn: GridColDef<PositionRow>[] = [
    // { headerName: "Product", field: "id", width: 0 },
    { headerName: "Instrument", field: "name", width: 0 },
    { headerName: "Qty.", field: "quantity", width: 0 },
    { headerName: "Avg.", field: "avgPrice", width: 0 },
    { headerName: "LTP", field: "LTP", width: 0 },
    { headerName: "P&L", field: "P&L", width: 0 },
    { headerName: "Change", field: "change", width: 0 },
  ];
  const PositionsTotal = useMemo(() => ({ "P&L": sumByKey(PositionsList, "P&L"), LTP: "TOTAL", skip: 3 }), [PositionsList]);

  return { Positions, PositionsList, PositionsTotal, PositionsGridColumn };
}
