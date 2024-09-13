import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

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

    // freeing locked amount
    await tx.assets.update({
      where: {
        unique_TradingAccountId_name: {
          TradingAccountId: Taccounts,
          name: res.type === "BUY" ? "USDT" : res.name,
        },
      },
      data: {
        freeAmount: {
          increment: res.type === "BUY" ? usdt_to_be_freed : Trade.quantity,
        },
        lockedAmount: {
          decrement: res.type === "BUY" ? usdt_to_be_freed : Trade.quantity,
        },
      },
    });
    return { ...Trade, status: "CANCELLED" };
  });
  return transection;
}
