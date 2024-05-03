import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const getAccountInfoRouter = createTRPCRouter({
  getInitInfo: protectedProcedure.query(async ({ ctx }) => {
    const Taccounts = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: true,
        },
      })
    )?.Taccounts[0];
    console.log("checking trading account -> ", Taccounts);

    if (!Taccounts) {
      await ctx.db.$transaction(async (tx) => {
        const res = await tx.tradingAccount.create({
          data: {
            User: { connect: { id: ctx.session.user.id } },
          },
        });
        const result = await tx.assets.create({
          data: {
            TradingAccount: { connect: { id: res.id } },
            freeAmount: 100000,
            AvgPrice: 1,
            name: "USDT",
          },
        });
        console.log("created new trading account -> ", res, result);
        return res;
      });
    }
    // return Taccounts;

    const data = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: {
            select: { watchList: true, Pin0: true, Pin1: true, id: true },
          },
        },
      })
    )?.Taccounts[0];

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
      return await ctx.db.assets.findFirst({
        where: { name: "USDT", TradingAccountId: input },
      });
    }),
  getAssets: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Orders = await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: {
          Assets: true,
        },
      });
      if (!Orders) return "error getting orders";
      else return Orders.Assets;
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
