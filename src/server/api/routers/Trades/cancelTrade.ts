import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import TsMap from "ts-map";

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

    //complete transection
    const res = await tx.order.update({
      where: {
        id: Orderid,
        TradingAccountId: Taccounts,
      },
      data: {
        status: "CANCELLED",
      },
    });

    const usdt_to_be_freed = Trade.quantity * Trade.price;
    console.log("canceling data ->", usdt_to_be_freed);

    if (res.type === "BUY")
      await tx.assets.update({
        where: {
          unique_TradingAccountId_name: {
            TradingAccountId: Taccounts,
            name: "USDT",
          },
        },
        data: {
          freeAmount: {
            increment: usdt_to_be_freed,
          },
          lockedAmount: {
            decrement: usdt_to_be_freed,
          },
        },
      });
    else
      await tx.assets.update({
        where: {
          unique_TradingAccountId_name: {
            TradingAccountId: Taccounts,
            name: res.name,
          },
        },
        data: {
          freeAmount: {
            increment: Trade.quantity,
          },
          lockedAmount: {
            decrement: Trade.quantity,
          },
        },
      });
    return { ...Trade, status: "CANCELLED" };
  });
  return transection;
}
