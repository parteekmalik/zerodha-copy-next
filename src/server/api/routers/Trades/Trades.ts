import { z } from "zod";
import { FormSchema } from "~/components/zerodha/OrderForm/FrmSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cancelOrderTranection from "./cancelTrade";
import createOrderTransection from "./createTrade";
import closeOrderTranection from "./closeTrade";
import getLTP from "~/components/zerodha/OrderForm/getLTP";

export const TradesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(FormSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.orderType === "SELL") return "only buy orders allowed";
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
  getFilledTrades: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Orders = await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: { Trades: { where: { status: "FILLED" } } },
      });
      if (!Orders) return "error getting orders";
      else return Orders.Trades.reverse();
    }),
  getPendingTrades: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Orders = await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: { Trades: { where: { status: "PENDING" } } },
      });
      if (!Orders) return "error getting orders";
      else return Orders.Trades.reverse();
    }),
  getCancel_ClosedTrades: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Orders = await ctx.db.tradingAccount.findFirst({
        where: { id: input },
        select: {
          Trades: { where: { status: { in: ["CLOSED", "CANCELLED"] } } },
        },
      });
      if (!Orders) return "error getting orders";
      else return Orders.Trades.reverse();
    }),

  cancelTrade: protectedProcedure
    .input(
      z.object({
        orderids: z.union([z.number(), z.string()]),
        Taccounts: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orderids = Number(input.orderids);
      const result = await cancelOrderTranection(
        ctx.db,
        orderids,
        input.Taccounts,
      );
      return result;
    }),
  closeOrders: protectedProcedure
    .input(
      z.object({
        orderids: z.union([z.number(), z.string()]),
        Taccounts: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orderids = Number(input.orderids);
      console.log(orderids);
      const result = await closeOrderTranection(
        ctx.db,
        orderids,
        input.Taccounts,
      );
      return result;
    }),
  updateTP_SL: protectedProcedure
    .input(
      z.object({
        orderids: z.union([z.number(), z.string()]),
        Taccounts: z.string(),
        type: z.union([z.literal("sl"), z.literal("tp")]),
        value: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orderids = Number(input.orderids);

      console.log(orderids);
      const order = await ctx.db.trades.findUnique({
        where: { id: orderids },
      });
      if (!order) return "cant find order";

      const price =
        order.status === "PENDING" ? order.openPrice : await getLTP(order.name);
      console.log(price);
      if (input.type === "sl" && price <= input.value)
        return "sl should be lower tan openprice" + price;
      if (input.type === "tp" && price >= input.value)
        return "tp should be higher tan openprice" + price;

      const result = await ctx.db.trades.update({
        where: { id: orderids },
        data: {
          sl: input.type === "sl" ? input.value : order.sl,
          tp: input.type !== "sl" ? input.value : order.tp,
        },
      });
      return result;
    }),
});
