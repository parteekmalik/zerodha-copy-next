import { symbol, z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountInfoRouter = createTRPCRouter({
  info: protectedProcedure.query(async ({ ctx, input }) => {
    return ctx.session.user;
  }),
  watchList: protectedProcedure.query(async ({ ctx, input }) => {
    const watchlist = await ctx.db.user.findFirst({
      where: { name: ctx.session.user.name },
      select: {
        Taccounts: {
          select: { watchList: { select: { name: true, row: true } } },
        },
      },
    });
    const watchlistFinal: string[][] = [];
    watchlist?.Taccounts[0]?.watchList.map((symbol) => {
      watchlistFinal[symbol.row] = symbol.name.split(" ");
    });
    return watchlistFinal;
  }),
});
