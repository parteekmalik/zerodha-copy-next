import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountInfoRouter = createTRPCRouter({
  info: protectedProcedure.query(async ({ ctx, input }) => {
    const Taccounts = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: { select: { id: true } },
        },
      })
    )?.Taccounts[0];
    console.log("checking trading account -> ", Taccounts);
    const data = { ...ctx.session.user, TradingAccountId: Taccounts?.id ?? "" };
    if (!Taccounts) {
      const res = await ctx.db.tradingAccount.create({
        data: {
          User: { connect: { id: ctx.session.user.id } },
        },
      });
      data.TradingAccountId = res.id;
      console.log("created new trading account -> ", res);
    }
    return data;
  }),
  getInitInfo: protectedProcedure.query(async ({ ctx, input }) => {
    const Taccounts = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: true,
        },
      })
    )?.Taccounts;
    console.log("checking trading account -> ", Taccounts);

    if (!Taccounts || Taccounts?.length === 0) {
      const res = await ctx.db.tradingAccount.create({
        data: {
          User: { connect: { id: ctx.session.user.id } },
        },
      });
      console.log("created new trading account -> ", res);
    }
    // return Taccounts;

    const data = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: {
            select: { watchList: true, Pin0: true, Pin1: true,id:true },
          },
        },
      })
    )?.Taccounts[0];

    if (data) {
      const { watchList, Pin0, Pin1,id } = data;
      return {
        userInfo: {...ctx.session.user,TradingAccountId:id},
        watchList: convert1D_2D(watchList ?? []),
        Pins: { Pin0: Pin0 ?? "BTCUSDT", Pin1: Pin1 ?? "ETHUSDT" },
      };
    }
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
  getPin: protectedProcedure.query(async ({ ctx, input }) => {
    const Pins = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: {
            select: { Pin0: true, Pin1: true },
          },
        },
      })
    )?.Taccounts[0];

    return Pins ?? { Pin0: "BTCUSDT", Pin1: "ETHUSDT" };
  }),
  getOrders: protectedProcedure.query(async ({ ctx, input }) => {
    const Orders = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: {
            select: { statement: true },
          },
        },
      })
    )?.Taccounts[0];
    if (!Orders) return "error getting orders";
    else return Orders.statement;
  }),
  updatePins: protectedProcedure
    .input(z.object({ name: z.string().min(1), pos: z.number().min(0).max(1) }))
    .mutation(async ({ ctx, input }) => {
      const details = (
        await ctx.db.user.findFirst({
          where: { name: ctx.session.user.name },
          select: {
            Taccounts: { select: { Pin0: true, Pin1: true, id: true } },
          },
        })
      )?.Taccounts[0];
      if (details) {
        const tradingAccountId = details?.id;
        const { Pin0, Pin1 } =
          input.pos === 0
            ? await ctx.db.tradingAccount.update({
                where: { id: tradingAccountId },
                data: { Pin0: input.name.toUpperCase() },
              })
            : await ctx.db.tradingAccount.update({
                where: { id: tradingAccountId },
                data: { Pin1: input.name.toUpperCase() },
              });

        return { Pin0, Pin1 };
      } else return "cant find trading account";
    }),
  updateWatchList: protectedProcedure
    .input(z.object({ name: z.string(), row: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const details = await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: { Taccounts: { select: { watchList: true, id: true } } },
      });
      const tradingAccountId = details?.Taccounts[0]?.id;
      const watchList =
        details?.Taccounts[0]?.watchList ?? (Array(7).fill("") as string[]);

      watchList[input.row] = input.name.toUpperCase();
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
