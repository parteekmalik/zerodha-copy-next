import { z } from "zod";
import { FormSchema } from "~/components/zerodha/OrderForm/FrmSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cancelOrderTranection from "./cancelTrade";
import createOrderTransection from "./createTrade";
import { getTradingAccount } from "./utils/getTradingAccount";
import { experimental_standaloneMiddleware } from "@trpc/server";
import { Order } from "@prisma/client";
import { sumByKey } from "~/lib/zerodha/utils";

export const OrderRouter = createTRPCRouter({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const Taccount = (await getTradingAccount(ctx)).id;
    const Orders = await ctx.db.tradingAccount.findFirst({
      where: { id: Taccount },
      select: { Orders: true },
    });
    if (!Orders) return "error getting orders";
    else return Orders.Orders.reverse();
  }),

  createOrder: protectedProcedure
    .input(FormSchema)
    .mutation(async ({ ctx, input }) => {
      const Taccount = (await getTradingAccount(ctx)).id;
      if (Taccount) {
        const res = await createOrderTransection({
          db: ctx.db,
          input,
          Taccount,
        });
        return res;
      }
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
      const orderIdsArray = Array.isArray(input.orderids)
        ? input.orderids
        : [input.orderids];

      // Use Promise.all to handle all asynchronous cancelOrderTransaction calls
      const result = await Promise.all(
        orderIdsArray.map((orderid) =>
          cancelOrderTranection(ctx.db, orderid, tradingAccountId),
        ),
      );

      return result;
    }),
  getRemainingFilledOrders: protectedProcedure.query(async ({ ctx, input }) => {
    const tradingAccountId = (await getTradingAccount(ctx)).id;

    const AssetsWithOrders = await ctx.db.tradingAccount.findUnique({
      where: {
        id: tradingAccountId,
      },
      select: {
        Assets: { where: { NOT: { name: "USDT" } }, include: { Orders: true } },
      },
    });
    if (AssetsWithOrders?.Assets) {
      return AssetsWithOrders.Assets.map((Asset) => {
        const buyOrdrers = Asset.Orders.filter(
          (i) => i.status === "COMPLETED" && i.type === "BUY",
        );
        const sellOrdrers = Asset.Orders.filter(
          (i) => i.status === "COMPLETED" && i.type === "SELL",
        );
        const sellOrdrersTotalQuantity = sumByKey(sellOrdrers, "quantity");
        let buyOrdrersTotalQuantity = 0;

        while (
          "0" in buyOrdrers &&
          buyOrdrersTotalQuantity + buyOrdrers[0].quantity <=
            sellOrdrersTotalQuantity
        ) {
          buyOrdrersTotalQuantity += buyOrdrers[0].quantity;
          buyOrdrers.pop();
        }
        if (
          buyOrdrersTotalQuantity !== sellOrdrersTotalQuantity &&
          "0" in buyOrdrers
        ) {
          buyOrdrers[0].quantity =
            sellOrdrersTotalQuantity - buyOrdrersTotalQuantity;
        }

        return {
          ...Asset,
          Orders: buyOrdrers,
          PositionDetails: convertIntoAvg(buyOrdrers),
        };
      }).filter((i) => i.PositionDetails.quantity > 0);
    }
  }),
});

const convertIntoAvg = (orders: Order[]) => {
  const data = {
    quantity: 0,
    avgPrice: 0,
    totalPrice: 0,
  };
  orders.map((order) => {
    data.quantity += order.quantity;
    data.totalPrice += order.quantity * order.price;
  });
  data.avgPrice = data.totalPrice / data.quantity;
  return data;
};
