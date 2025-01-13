import { useMemo } from "react";
import { modifyNumber } from "~/app/v1/utils";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { sumByKey } from "~/lib/zerodha/utils";
import { api } from "~/trpc/react";

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
    const currentTotalPrice = Number(LTP) * quantity;
    const change = modifyNumber((currentTotalPrice / totalPrice - 1) * 100, 2);
    return {
      id,
      name,
      quantity: modifyNumber(quantity, 2),
      avgPrice: modifyNumber(avgPrice, 3),
      totalPrice,
      currentTotalPrice,
      LTP,
      "P&L": PL,
      change,
    };
  });
  const PositionsTotal = useMemo(
    () => ({
      "P&L": sumByKey(PositionsList, "P&L"),
      LTP: "TOTAL",
      change: (sumByKey(PositionsList, "currentTotalPrice") / sumByKey(PositionsList, "totalPrice") - 1) * 100,
    }),
    [PositionsList],
  );

  return { Positions, PositionsList, PositionsTotal };
}
