"use client";
import { type $Enums } from "@prisma/client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { twMerge } from "tailwind-merge";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import useCreateOrderApi from "~/components/zerodha/_hooks/API/useCreateOrderApi";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import { updateSeprateSubscriptions } from "~/components/zerodha/_redux/Slices/BinanceWSStats";
import { type AppDispatch } from "~/components/zerodha/_redux/store";
import { FormSchema } from "~/components/zerodha/OrderForm/FormSchema";
import { type PositionRow, TableDefaultstyles } from "~/components/zerodha/Table/defaultStylexAndTypes";
import MobileTable, { type MobileRowType } from "~/components/zerodha/Table/mobileTable/MobileTable";
import DataGrid from "~/components/zerodha/Table/table";
import { getColor, modifyNumber } from "../utils";
import usePositions, { type TPositionsList } from "./usePositions";

export default function DefaultComonent() {
  const { Positions, PositionsGridColumn, PositionsList, PositionsTotal } = usePositions();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (Positions)
      dispatch(
        updateSeprateSubscriptions({
          name: "positions",
          subsription: Positions.map((i) => i.name).filter((i) => i.toLowerCase() !== "usdt"),
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
  }, [Positions, dispatch]);

  const { CreateOrderAPI } = useCreateOrderApi();

  const handleFn = (items: PositionRow[]) => {
    // Placeholder function for handling selection
    const orders = items.map((position) => {
      const data = {
        orderType: Number(position.quantity) ? "SELL" : "BUY",
        quantity: Number(position.quantity),
        trigerType: "MARKET",
        price: 0,
        symbolName: position.name,
        marketType: "SPOT",
      };
      console.log(data);
      return FormSchema.parse(data);
    });
    CreateOrderAPI.mutate(orders);
  };
  const MobileTableData = MobileData({ PositionsList });
  const { isDeviceCompatible } = useDeviceType();
  if (!PositionsList) return null;
  return (
    <div className=" w-full p-4">
      <div className="flex py-2">
        <h1 className="text-xl opacity-80">Positions({Positions ? Positions.length : 0})</h1>
      </div>
      {isDeviceCompatible("lg") ? (
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
      ) : (
        <MobileTable options={{ Add: true, Close: true }} orders={MobileTableData} />
      )}
    </div>
  );
}
const positiveAndColor = (row: PositionRow, key: keyof PositionRow, styles: string) => {
  const newValue = Number(row[key]);
  const result: [string, string] = [String(newValue), twMerge(styles, getColor(newValue))];
  return result;
};
function MobileData({ PositionsList }: { PositionsList: TPositionsList[] }): MobileRowType {
  const { Livestream } = useBinanceLiveData();

  return PositionsList.map((position) => {
    return {
      raw: { name: position.name, id: Number(position.id), type: Number(position.quantity) > 0 ? "BUY" : ("SELL" as $Enums.OrderType) },
      content: [
        {
          first: [
            <div key={"quantity"} className="flex gap-1">
              <span>Qty.</span>
              <div className="text-textDark/60"> {position.quantity}</div>
            </div>,
            <div key={"dot"} className="flex items-center justify-center">
              <p className="h-2 w-2 rounded-full bg-textDark"></p>
            </div>,
            <div key={"avgPrice"} className="flex gap-1">
              <span>Avg.</span>
              <div className="text-textDark/60"> {position.avgPrice}</div>
            </div>,
          ],
          second: [
            <div key={"change"} className={getColor(Number(position.change))}>
              {modifyNumber(position.change, 2, true)}%
            </div>,
          ],
        },
        {
          first: [position.name],
          second: [
            <div key={"P&L"} className={getColor(Number(position["P&L"]))}>
              {modifyNumber(position["P&L"], 2, true)}
            </div>,
          ],
        },
        {
          first: [
            <div key={"Invested"} className="flex gap-1">
              <span>Invested</span>
              <div className="text-textDark/60"> {position.totalPrice.toFixed(2)}</div>
            </div>,
          ],
          second: [
            <div key={"LTP"} className="flex gap-1">
              <span>LTP</span>
              <div className="text-textDark/60"> {position.LTP}</div>
            </div>,
            <div key={"PriceChangePercent"} className={getColor(Number(Livestream[position.name]?.PriceChangePercent))}>
              ({Livestream[position.name]?.PriceChangePercent}%)
            </div>,
          ],
        },
      ],
    };
  });
}
