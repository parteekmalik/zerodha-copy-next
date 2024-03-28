import { FormSchema } from "~/app/zerodha/_components/OrderForm/FrmSchema";

import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(FormSchema)
    .mutation(async ({ ctx, input }) => {
      const Taccounts = (
        await ctx.db.user.findFirst({
          where: { name: ctx.session.user.name },
          select: {
            Taccounts: { select: { id: true } },
          },
        })
      )?.Taccounts[0];
      if (Taccounts) {
        const res = await ctx.db.orders.create({
          data: {
            name: input.symbolName,
            type: input.orderType,
            status: input.trigerType === "MARKET" ? "completed" : "open",
            triggerType: input.trigerType,
            TradingAccountId: Taccounts.id,
            price: input.price,
            quantity: input.quantity,
          },
        });
        return res;
      }
    }),
});
