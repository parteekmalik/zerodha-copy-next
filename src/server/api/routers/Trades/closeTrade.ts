import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import getLTP from "~/components/zerodha/OrderForm/getLTP";

// TODO: add logic for limit orders (add lockedBalance)
export default async function closeOrderTranection(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: number,
  Taccounts: string,
) {
  const transection = await db.$transaction(async (tx) => {
    const trade = await tx.trades.findUnique({
      where: { id: input },
    });
    if (!trade) return "unexpeted error";
    const name = trade.name.slice(0, -4).toUpperCase();

    const curPrice = await getLTP(trade.name);
    const data = {
      USDT: trade.quantity * curPrice,
      asset: trade.quantity,
    };

    const res = await tx.trades.update({
      where: {
        id: trade.id,
      },
      data: {
        status: "CLOSED",
        closePrice: curPrice,
      },
    });

    await tx.tradeAssets.update({
      where: {
        unique_TradingAccountId_name: {
          TradingAccountId: Taccounts,
          name,
        },
        TradingAccountId: Taccounts,
        name,
      },
      data: {
        freeAmount: {
          decrement: data.asset,
        },
      },
    });
    await tx.tradingAccount.update({
      where: {
        id: Taccounts,
      },
      data: {
        USDT_Free_balance: {
          increment: data.USDT,
        },
      },
    });
    return res;
  });
  return transection;
}
