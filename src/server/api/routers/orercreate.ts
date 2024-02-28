import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        orderType: z.enum(["BUY", "SELL"]),
        quantity: z.number().min(0.0001),
        price: z.number(),
        sl: z.number(),
        tp: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("order recieved");

      const Taccounts = (
        await ctx.db.user.findFirst({
          where: { name: ctx.session.user.name },
          select: {
            Taccounts: true,
          },
        })
      )?.Taccounts[0];
      if (Taccounts) {
        const res = await ctx.db.$transaction(async (tx) => {
          // const transection = await tx.transection.create({
          //   data: {
          //     type: "BUY",
          //     amount: 12,
          //     asset: "BTC",
          //     tradingAccountId: Taccounts?.id
          //   },KW
          // });
          const fullorder = await tx.fullOrder.create({
            data: {
              status: "patial-filled",
              name: "BTCUSDT",
              type: "BUY",
              price: 0,
              avgPrice: 0,
              totalAmount: 12,
              filledAmount: 0,
              // TransectionId: transection.id,
              TradingAccountId: Taccounts?.id ?? "dummy_id",
            },
          });
        });
        console.log("res ->", res);
      }
    }),
});
