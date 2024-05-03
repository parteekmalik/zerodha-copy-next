import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { convert1D_2D } from "./accountInfo";
import USDTBalance from "./USDTBalance";

export const updateAccountInfoRouter = createTRPCRouter({
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
      console.log("updateWatchList -> ", input);
      const details = (
        await ctx.db.user.findFirst({
          where: { name: ctx.session.user.name },
          select: { Taccounts: { select: { watchList: true, id: true } } },
        })
      )?.Taccounts[0];
      if (details) {
        const tradingAccountId = details.id;
        const watchList = details.watchList;

        watchList[input.row] = input.name.toUpperCase();
        const res = (
          await ctx.db.tradingAccount.update({
            where: { id: tradingAccountId },
            data: { watchList },
          })
        ).watchList;

        return convert1D_2D(res);
      } else console.log("trading account not found", details);
    }),
  addBalance: protectedProcedure
    .input(
      z.object({
        account: z.string().min(1),
        amount: z.number().min(-5000).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await USDTBalance(ctx.db, input);
    }),
});
