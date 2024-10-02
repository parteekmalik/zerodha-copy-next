import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

// TODO: add logic for limit orders (add lockedBalance)
export default async function cancelOrderTranection(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  Orderid: number,
  Taccounts: string,
) {
  const transection = await db.$transaction(async (tx) => {
    const Trade = await tx.order.findUnique({
      where: { id: Orderid, status: "OPEN" },
    });

    if (!Trade) return "unexpeted error for order: " + Orderid;

    const usdt_to_be_freed = Trade.quantity * Trade.price;
    console.log("canceling data ->", usdt_to_be_freed);
    const isBuyOrder = Trade.type === "BUY";
    const data = isBuyOrder
      ? {
          name: "USDT",
          data: {
            freeAmount: {
              increment: usdt_to_be_freed,
            },
            lockedAmount: {
              decrement: usdt_to_be_freed,
            },
          },
        }
      : {
          name: Trade.name.slice(0, -4).toUpperCase(),
          data: {
            freeAmount: {
              increment: Trade.quantity,
            },
            lockedAmount: {
              decrement: Trade.quantity,
            },
          },
        };
    // freeing locked amount
    await tx.assets.update({
      where: {
        unique_TradingAccountId_name: {
          TradingAccountId: Taccounts,
          name: data.name,
        },
      },
      data: data.data,
    });
    return await tx.order.update({
      where: {
        id: Orderid,
        TradingAccountId: Taccounts,
      },
      data: {
        status: "CANCELLED",
      },
    });
  });
  return transection;
}
