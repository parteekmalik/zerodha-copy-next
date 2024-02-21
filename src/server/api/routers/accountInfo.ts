import { symbol, z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountInfoRouter = createTRPCRouter({
  info: protectedProcedure.query(async ({ ctx, input }) => {
    return ctx.session.user;
  }),
  watchList: protectedProcedure.query(async ({ ctx, input }) => {
    const watchlist = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: {
            select: { watchList: true },
          },
        },
      })
    )?.Taccounts[0]?.watchList;

    const watchlistFinal: string[][] = [[]];
    watchlist?.map((symbol) => {
      watchlistFinal.push(symbol.split(" "));
    });
    return watchlistFinal;
  }),
  updateWatchList: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        row: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const details = await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: { Taccounts: { select: { watchList: true, id: true } } },
      });
      const tradingAccountId = details?.Taccounts[0]?.id;
      const watchList = details?.Taccounts[0]?.watchList ?? [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ];

      watchList[input.row] = input.name;

      const res = (
        await ctx.db.tradingAccount.update({
          where: { id: tradingAccountId },
          data: { watchList },
        })
      ).watchList;
      const watchlistFinal: string[][] = [];
      res?.map((symbol) => {
        watchlistFinal.push(symbol.split(" "));
      });
      return watchlistFinal;
    }),
});
