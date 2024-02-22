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
        // return ctx.db.$transaction([
        //   ctx.db.
        // ]);
      console.log("order recieved");
    }),
});
