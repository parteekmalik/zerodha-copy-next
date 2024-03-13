import axios from "axios";
import { error } from "console";
import moment from "moment";
import { z } from "zod";
import { FormSchema } from "~/app/zerodha/_components/OrderForm/FrmSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PendingOrdersExecution } from "./customServer";

console.log("hello");

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(FormSchema)
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
        if (input.trigerType === "MARKET") {
          const curPrice = await getLTP(input.symbolName);
          await ctx.db.fullOrder.create({
            data: {
              status: "completed",
              name: input.symbolName,
              type: input.orderType,
              price: curPrice,
              avgPrice: curPrice,
              trigerType: input.trigerType,
              totalAmount: input.quantity,
              filledAmount: input.quantity,
              // TransectionId: transection.id,
              TradingAccountId: Taccounts.id,
            },
          });
        } else {
          // ctx.orders.push({
          //   createsAt: moment().toDate(),
          //   status: "patial_filled",
          //   name: input.symbolName,
          //   type: input.orderType,
          //   price: input.price,
          //   avgPrice: 0,
          //   totalAmount: input.quantity,
          //   trigerType: input.trigerType,
          //   filledAmount: 0,
          //   // TransectionId: transection.id,
          //   TradingAccountId: Taccounts.id,
          // });
          // if (!ctx.isOrderServerRunning) {
          //   PendingOrdersExecution();
          //   ctx.isOrderServerRunning = true;
          // }
          return await axios.post("",{
            status: "patial_filled",
            name: input.symbolName,
            type: input.orderType,
            price: input.price,
            avgPrice: 0,
            totalAmount: input.quantity,
            trigerType: input.trigerType,
            filledAmount: 0,
            // TransectionId: transection.id,
            TradingAccountId: Taccounts.id,
          })
        }
        console.log("order transection comleted");
      }
      return "sucess";
    }),
});
async function getLTP(symbol: string) {
  const url = "https://api.binance.us/api/v3/ticker/price?symbol=" + symbol;
  const res = (await axios.get(url)).data as { symbol: string; price: string };
  console.log("getLTP " + symbol + " -> ", res);
  return Number(res.price);
}
