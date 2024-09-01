"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/components/zerodha/_redux/store";
import DataGrid, {
  DataGridStyles,
  GridColDef,
} from "~/components/zerodha/Table/table";
import { sumByKey } from "~/lib/zerodha/utils";
import { api } from "~/trpc/react";

const styles: DataGridStyles = {
  table: {
    className: "w-full  ",
  },
  head: {
    className: "opacity-50 text-sm  ",
    row: "border-y-[1px] border-gray-300 ",
    cell: "py-2 px-4 font-thin",
  },
  body: {
    className: "text-textDark",
    row: "border-b-[1px] border-gray-300",
    cell: "text-center uppercase  font-thin py-2 px-4",
  },
  checkbox: "text-center",
};
export default function DefaultComonent() {
  const Livestream = useSelector((state: RootState) => state.Livestream);
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
    const PL = ((Number(LTP) - avgPrice) * quantity).toFixed(2);
    const change = (Number(LTP) / avgPrice - 1).toFixed(2);
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
  if (!PositionsList) return null;
  return (
    <div className="dark p-4">
      <div className="flex py-2">
        <h1 className="text-xl opacity-80">Positions({Positions.length})</h1>
      </div>
      <DataGrid
        rows={PositionsList}
        columns={PositionsGridColumn}
        coloredCols={["P&L", "quantity", "change"]}
        selected={handleFn}
        fotter={PositionsTotal}
        styles={styles}
      />
    </div>
  );
}
