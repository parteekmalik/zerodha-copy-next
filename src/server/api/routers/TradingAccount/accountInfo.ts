import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getTradingAccount } from "../Trades/utils/getTradingAccount";

export const getAccountInfoRouter = createTRPCRouter({
  getInitInfo: protectedProcedure.query(async ({ ctx }) => {
    const data = await getTradingAccount(ctx);
    // return Taccounts;

    if (data) {
      const { watchList, Pin0, Pin1, id } = data;
      return {
        userInfo: { ...ctx.session.user, TradingAccountId: id },
        watchList: convert1D_2D(watchList ?? []),
        Pins: { Pin0: Pin0 ?? "BTCUSDT", Pin1: Pin1 ?? "ETHUSDT" },
      };
    }
  }),
  getBalance: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: { USDT_Free_balance: true, USDT_Locked_balance: true },
      });
    }),
});

export function convert1D_2D(input: string[]): string[][] {
  const watchlistFinal: string[][] = [];
  input?.map((symbol) => {
    watchlistFinal.push(
      symbol.split(" ").filter((x) => {
        if (x !== "") return x;
      }),
    );
  });
  console.log(watchlistFinal);
  return watchlistFinal;
}
