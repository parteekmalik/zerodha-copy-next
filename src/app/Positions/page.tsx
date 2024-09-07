"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { RootState } from "~/components/zerodha/_redux/store";
import {
  GridColDef,
  PositionRow,
  TableDefaultstyles,
} from "~/components/zerodha/Table/defaultStylexAndTypes";
import DataGrid from "~/components/zerodha/Table/table";
import { sumByKey } from "~/lib/zerodha/utils";
import { api } from "~/trpc/react";
import { modifyNumber, getColor } from "../utils";

export default function DefaultComonent() {
  const { Livestream } = useBinanceLiveData();

  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  const subsciptions = useSelector(
    (state: RootState) => state.BinanceWSStats.subsciptions,
  );
  const Positions = api.Order.getRemainingFilledOrders.useQuery().data ?? [];
  const PositionsList = Positions.map((item) => {
    const {
      id,
      PositionDetails: { quantity, avgPrice, totalPrice },
    } = item;
    const name = item.Orders[0]?.name ?? "error";
    const LTP = Livestream[name]?.curPrice;
    const PL = modifyNumber((Number(LTP) - avgPrice) * quantity, 2,true);
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

  const handleFn = (ids: (string | number)[]) => {
    // Placeholder function for handling selection
    console.log("submitted: ", ids);
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
        <h1 className="text-xl opacity-80">Positions({Positions.length})</h1>
      </div>
      <DataGrid<PositionRow>
        rows={PositionsList}
        columns={PositionsGridColumn}
        coloredCols={[
          { name: "P&L", fn: positiveAndColor },
          { name: "quantity", fn: positiveAndColor },
          { name: "change", fn: positiveAndColor },
        ]}
        selected={handleFn}
        footer={PositionsTotal}
        styles={TableDefaultstyles}
      />
    </div>
  );
}
