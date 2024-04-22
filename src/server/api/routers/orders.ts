import moment from "moment";
import { z } from "zod";
import { FormSchema } from "~/components/zerodha/OrderForm/FrmSchema";
import getLTP from "~/components/zerodha/OrderForm/getLTP";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
            price:
              input.trigerType === "MARKET"
                ? await getLTP(input.symbolName)
                : input.price,
            quantity: input.quantity,
          },
        });
        return res;
      }
    }),
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const Orders = (
      await ctx.db.user.findFirst({
        where: { name: ctx.session.user.name },
        select: {
          Taccounts: {
            select: { statemnet: true },
          },
        },
      })
    )?.Taccounts[0];
    if (!Orders) return "error getting orders";
    else return Orders.statemnet.reverse();
  }),
  getOrders24hr: protectedProcedure.query(async ({ ctx }) => {
    const Orders = (
      await ctx.db.user.findFirst({
        where: {
          name: ctx.session.user.name,
        },
        select: {
          Taccounts: {
            select: {
              statemnet: {
                where: {
                  createdAt: {
                    gte: moment().startOf("day").toDate(),
                  },
                },
              },
            },
          },
        },
      })
    )?.Taccounts[0];
    if (!Orders) return "error getting orders";
    else return Orders.statemnet;
  }),
  cancelOrders: protectedProcedure
    .input(z.array(z.string()))
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
        const res = await ctx.db.orders.updateMany({
          where: { id: { in: input }, TradingAccountId: Taccounts.id },
          data: {
            status: "cancelled",
          },
        });
        return res;
      }
    }),
});
