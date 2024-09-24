import { z } from "zod";
import { FormSchema } from "~/components/zerodha/OrderForm/FormSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cancelOrderTranection from "./cancelTrade";
import createOrderTransection from "./createTrade";
import { getTradingAccount } from "./utils/getTradingAccount";

export const OrderRouter = createTRPCRouter({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const Taccount = (await getTradingAccount(ctx)).id;
    const Orders = await ctx.db.tradingAccount.findFirst({
      where: { id: Taccount },
      select: {
        Orders: {
          orderBy: {
            closedAt: "desc",
          },
        },
      },
    });
    if (!Orders) return "error getting orders";
    else return Orders.Orders;
  }),

  createOrder: protectedProcedure.input(z.union([FormSchema, z.array(FormSchema)])).mutation(async ({ ctx, input }) => {
    const tradingAccountId = (await getTradingAccount(ctx)).id;
    // Ensure orderids is an array
    const ordersArray = Array.isArray(input) ? input : [input];

    // Use Promise.all to handle all asynchronous createOrderTransection calls
    const result = await Promise.all(
      ordersArray.map((order) =>
        createOrderTransection({
          db: ctx.db,
          input: order,
          Taccount: tradingAccountId,
        }),
      ),
    );

    return result;
  }),
  cancelTrade: protectedProcedure
    .input(
      z.object({
        orderids: z.union([z.number(), z.array(z.number())]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tradingAccountId = (await getTradingAccount(ctx)).id;
      // Ensure orderids is an array
      const orderIdsArray = Array.isArray(input.orderids) ? input.orderids : [input.orderids];

      // Use Promise.all to handle all asynchronous cancelOrderTransaction calls
      const result = await Promise.all(
        orderIdsArray.map((orderid) => cancelOrderTranection(ctx.db, orderid, tradingAccountId)),
      );

      return result;
    }),
});
