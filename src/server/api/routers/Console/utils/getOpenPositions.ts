import { type Assets, type Order, type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { sumByKey } from "../../../../../lib/zerodha/utils";

export default async function getOpenPositions({
  db,
  tradingAccountId,
}: {
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  tradingAccountId: string;
}) {
  const AssetsWithOrders = await db.assets.findMany({
    where: {
      TradingAccountId: tradingAccountId,
      NOT: { name: "USDT" },
    },
    include: { Orders: { orderBy: { closedAt: "asc" } } },
  });
  const result = getRemainingOrders(AssetsWithOrders);
  return result.filter((i) => i.PositionDetails.quantity > 0);
}

export const convertIntoAvg = (orders: Order[]) => {
  const data = {
    quantity: 0,
    avgPrice: 0,
    totalPrice: 0,
  };
  orders.map((order) => {
    data.quantity += order.quantity;
    data.totalPrice += order.quantity * order.price;
  });
  data.avgPrice = data.totalPrice / data.quantity;
  return data;
};

export function getRemainingOrders(AssetsWithOrders: (Assets & { Orders: Order[] })[]) {
  return AssetsWithOrders.map((Asset) => {
    const buyOrdrers = Asset.Orders.filter((i) => i.status === "COMPLETED" && i.type === "BUY");
    const sellOrdrers = Asset.Orders.filter((i) => i.status === "COMPLETED" && i.type === "SELL");
    const sellOrdrersTotalQuantity = sumByKey(sellOrdrers, "quantity");
    let buyOrdrersTotalQuantity = 0;
    while ("0" in buyOrdrers && buyOrdrersTotalQuantity + buyOrdrers[0].quantity <= sellOrdrersTotalQuantity) {
      buyOrdrersTotalQuantity += buyOrdrers[0].quantity;
      buyOrdrers.shift();
    }
    if (buyOrdrersTotalQuantity !== sellOrdrersTotalQuantity && "0" in buyOrdrers) {
      buyOrdrers[0].quantity -= sellOrdrersTotalQuantity - buyOrdrersTotalQuantity;
    }

    return {
      ...Asset,
      Orders: buyOrdrers,
      PositionDetails: convertIntoAvg(buyOrdrers),
    };
  });
}
