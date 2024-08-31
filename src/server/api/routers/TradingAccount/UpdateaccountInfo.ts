import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getTradingAccount } from "../Trades/utils/getTradingAccount";
import { convert1D_2D } from "./accountInfo";

export const updateAccountInfoRouter = createTRPCRouter({
  updatePins: protectedProcedure
    .input(z.object({ name: z.string().min(1), pos: z.number().min(0).max(1) }))
    .mutation(async ({ ctx, input }) => {
      const details = await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: { select: { Pin0: true, Pin1: true, id: true } },
        },
      });

      if (details?.Taccounts) {
        const tradingAccountId = details.Taccounts.id;
        const updatedAccount =
          input.pos === 0
            ? await ctx.db.tradingAccount.update({
                where: { id: tradingAccountId },
                data: { Pin0: input.name.toUpperCase() },
              })
            : await ctx.db.tradingAccount.update({
                where: { id: tradingAccountId },
                data: { Pin1: input.name.toUpperCase() },
              });

        return { Pin0: updatedAccount.Pin0, Pin1: updatedAccount.Pin1 };
      } else {
        return "can't find trading account";
      }
    }),

  updateWatchList: protectedProcedure
    .input(z.object({ name: z.string(), row: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log("updateWatchList -> ", input);
      const details = await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: { Taccounts: { select: { watchList: true, id: true } } },
      });

      if (details?.Taccounts) {
        const tradingAccountId = details.Taccounts.id;
        const watchList = details.Taccounts.watchList;

        watchList[input.row] = input.name.toUpperCase();
        const updatedWatchList = await ctx.db.tradingAccount.update({
          where: { id: tradingAccountId },
          data: { watchList },
        });

        return convert1D_2D(updatedWatchList.watchList);
      } else {
        console.log("trading account not found", details);
      }
    }),

  updateBalance: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = (await getTradingAccount(ctx)).id;
      const curBal = (
        await ctx.db.assets.findUnique({
          where: {
            unique_TradingAccountId_name: {
              TradingAccountId: account,
              name: input.name,
            },
          },
        })
      )?.freeAmount;

      if (curBal !== undefined && curBal + input.amount >= 0) {
        return await ctx.db.assets.update({
          where: {
            unique_TradingAccountId_name: {
              TradingAccountId: account,
              name: input.name,
            },
          },
          data: { freeAmount: curBal + input.amount },
        });
      } else {
        return "insufficient balance";
      }
    }),
});
