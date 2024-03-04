import axios from "axios";
import { z } from "zod";
import { FormSchema } from "~/app/zerodha/_components/OrderForm/orderForm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      FormSchema
    )
    .mutation(async ({ ctx, input }) => {
      console.log("order recieved", input);

      const Taccounts = (
        await ctx.db.user.findFirst({
          where: { name: ctx.session.user.name },
          select: {
            Taccounts: true,
          },
        })
      )?.Taccounts[0];
      if (Taccounts) {
        if (input.price === 0) {
          const curPrice = await getLTP(input.symbolName);
          await ctx.db.fullOrder.create({
            data: {
              status: "completed",
              name: input.symbolName,
              type: input.orderType,
              price: curPrice,
              avgPrice: curPrice,
              totalAmount: input.quantity,
              filledAmount: input.quantity,
              // TransectionId: transection.id,
              TradingAccountId: Taccounts?.id ?? "dummy_id",
            },
          });
        } else
          await ctx.db.fullOrder.create({
            data: {
              status: "patial_filled",
              name: input.symbolName,
              type: input.orderType,
              price: input.price,
              avgPrice: 0,
              totalAmount: input.quantity,
              filledAmount: 0,
              // TransectionId: transection.id,
              TradingAccountId: Taccounts?.id ?? "dummy_id",
            },
          });
        console.log("order transection comleted");
      }
    }),
});
async function getLTP(symbol: string) {
  const url = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol;
  const res = (await axios.get(url)).data as { symbol: string; price: string };
  console.log("getLTP " + symbol + " -> ", res);
  return Number(res.price);
}
