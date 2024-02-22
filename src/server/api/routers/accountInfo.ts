import { symbol, z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountInfoRouter = createTRPCRouter({
  info: protectedProcedure.query(async ({ ctx, input }) => {
    const Taccounts = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: true,
        },
      })
    )?.Taccounts;
    console.log(" trading account -> ", Taccounts);

    if (!Taccounts || Taccounts?.length === 0) {
      const res = await ctx.db.tradingAccount.create({
        data: {
          User: { connect: { id: ctx.session.user.id } },
        },
      });
      console.log("created new trading account -> ", res);
    }
    // return Taccounts;
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

    return convert1D_2D(watchlist ?? []);
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
      const watchList =
        details?.Taccounts[0]?.watchList ?? (Array(7).fill("") as string[]);

      watchList[input.row] += " " + input.name;
      const res = (
        await ctx.db.tradingAccount.update({
          where: { id: tradingAccountId },
          data: { watchList },
        })
      ).watchList;

      return convert1D_2D(res);
    }),
  deleteIteminWatchList: protectedProcedure
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
      const watchList =
        details?.Taccounts[0]?.watchList ?? (Array(7).fill("") as string[]);

      console.log("before->", watchList, input);
      watchList[input.row] = (watchList[input.row] ?? "")
        ?.split(" ")
        .filter((x) => {
          if (x !== input.name.toLowerCase()) return x;
        })
        .join(" ");
      console.log("after->", watchList, input);

      const res = (
        await ctx.db.tradingAccount.update({
          where: { id: tradingAccountId },
          data: { watchList },
        })
      ).watchList;

      return convert1D_2D(res);
    }),
});
function convert1D_2D(input: string[]): string[][] {
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
