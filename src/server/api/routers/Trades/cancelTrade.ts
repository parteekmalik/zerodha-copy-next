import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import TsMap from "ts-map";

// TODO: add logic for limit orders (add lockedBalance)
export default async function cancelOrderTranection(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: number,
  Taccounts: string,
) {
  const transection = await db.$transaction(async (tx) => {
    const Trade = await tx.trades.findUnique({
      where: { id: input, status: "PENDING" },
    });

    if (!Trade) return "unexpeted error";
    // TODO: cal amount to be released and store in variable

    const usdt_to_be_freed = Trade.quantity * Trade.openPrice;

    //complete transection
    const res = await tx.trades.update({
      where: {
        id: input,
        TradingAccountId: Taccounts,
      },
      data: {
        status: "CANCELLED",
      },
    });
    console.log("canceling data ->", usdt_to_be_freed);

    await tx.tradingAccount.update({
      where: {
        id: Taccounts,
      },
      data: {
        USDT_Free_balance: {
          increment: usdt_to_be_freed,
        },
        USDT_Locked_balance: {
          decrement: usdt_to_be_freed,
        },
      },
    });
    return { ...Trade, status: "CANCELLED" };
  });
  return transection;
}
