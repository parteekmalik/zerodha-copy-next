import { getLast24hrData } from "~/components/zerodha/_redux/middlewares/subsciptions";
import { convertIntoAvg } from "./getOpenPositions";
import { sumByKey } from "~/lib/zerodha/utils";

export default async function getCurrentPositionDetails(
  list: (ReturnType<typeof convertIntoAvg> & { name: string })[],
) {
  const assetNamesList = list.map((i) => i.name + "USDT");
  const currentPrices = assetNamesList.length
    ? await getLast24hrData(assetNamesList)
    : [];
  const data = list.map((asset) => {
    const currentTotal =
      Number(
        currentPrices.find((i) => i.symbol === asset.name + "USDT")?.curPrice ??
          0,
      ) * asset.quantity;
    const profit = currentTotal - asset.totalPrice;
    return {
      ...asset,
      profit,
      currentTotal,
    };
  });
  const profit = sumByKey(data, "profit").toFixed(2);
  const result = {
    profit,
    profitPercent: (
      (Number(profit) * 100) /
      sumByKey(data, "totalPrice")
    ).toFixed(2),
    count: data.length,
    currentTotal: sumByKey(data, "currentTotal").toFixed(2),
    totalPrice: sumByKey(data, "totalPrice").toFixed(2),
  };
  return result;
}
