import { TRPCError } from "@trpc/server";
import { string, z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const updateAcoount = createTRPCRouter({
  addBalance: protectedProcedure
    .input(
      z.object({
        account: z.string().min(1),
        amount: z.number().min(-1000).max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.tradingAccount.findUnique({
        where: { id: input.account },
      });

      if (!account) {
        // throw new TRPCError({
        //   code: "INTERNAL_SERVER_ERROR",
        //   message: "Account not found.",
        //   // optional: pass the original error to retain stack trace
        // });
        return "Insufficient funds";
      }

      const newBalance = account.balance + input.amount;

      if (newBalance < 0) {
        // throw new TRPCError({
        //   code: "INTERNAL_SERVER_ERROR",
        //   message: "Insufficient funds.",
        //   // optional: pass the original error to retain stack trace
        // });
        return "Insufficient funds";
      }

      const updatedAccount = await ctx.db.tradingAccount.update({
        where: { id: input.account },
        data: { balance: newBalance },
      });
      return updatedAccount;
    }),
  getbalance: protectedProcedure
    .input(
      z.object({
        account: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        await ctx.db.tradingAccount.findUnique({
          where: { id: input.account },
          select: {
            balance: true,
          },
        })
      )?.balance;
    }),
});
