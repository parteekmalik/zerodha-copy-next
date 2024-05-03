import moment from "moment";
import { z } from "zod";
import { FormSchema } from "~/components/zerodha/OrderForm/FrmSchema";
import getLTP from "~/components/zerodha/OrderForm/getLTP";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import createOrderTransection from "./createOrderTransection";
import cancelOrderTranection from "./cancelorderTranection";

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
        const res = await createOrderTransection(ctx.db, input, Taccounts);
        return res;
      }
    }),
  getOrders: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Orders = await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: { statemnet: true },
      });
      if (!Orders) return "error getting orders";
      else return Orders.statemnet.reverse();
    }),
  getOrders24hr: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Orders = await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: {
          statemnet: {
            where: {
              createdAt: {
                gte: moment().startOf("day").toDate(),
              },
            },
          },
        },
      });
      if (!Orders) return "error getting orders";
      else return Orders.statemnet;
    }),

  cancelOrders: protectedProcedure
    .input(z.object({ orderids: z.array(z.string()), Taccounts: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await cancelOrderTranection(
        ctx.db,
        input.orderids,
        input.Taccounts,
      );
      return result;
    }),
});
