import axios from "axios";
import { error } from "console";
import { z } from "zod";
import { FormSchema } from "~/app/zerodha/_components/OrderForm/FrmSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
      console.log(Taccounts);
      if (Taccounts) {
        console.log("inside taccout if");
        console.log(input.trigerType, "MARKET", input.trigerType === "MARKET");
        if (input.trigerType === "MARKET") {
          console.log("inside triger if");
          console.log("running curPrice");
          const curPrice = await getLTP(input.symbolName);
          console.log("curPrice->", curPrice);
          console.log("data->", {
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
          });
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
        } else
          await ctx.db.fullOrder.create({
            data: {
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
            },
          });
        console.log("order transection comleted");
      }
      return "sucess";
    }),
});
async function getLTP(symbol: string) {
  const url = "https://api.binance.us/api/v3/ticker/price?symbol=" + symbol;
  console.log("url", url);
  axios
    .get(url)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
  const res = (await axios.get(url)).data as { symbol: string; price: string };
  console.log("getLTP " + symbol + " -> ", res);
  return Number(res.price);
}
