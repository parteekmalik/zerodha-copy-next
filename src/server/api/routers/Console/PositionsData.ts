import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getTradingAccount } from "../Trades/utils/getTradingAccount";
import getOpenPositions from "./utils/getOpenPositions";
import getCurrentPositionDetails from "./utils/getCurrentPositionDetails";

export const PositionsData = createTRPCRouter({
  getRemainingFilledOrders: protectedProcedure.query(async ({ ctx }) => {
    const tradingAccountId = (await getTradingAccount(ctx)).id;
    return await getOpenPositions({ db: ctx.db, tradingAccountId });
  }),
  getPositionCurrentDetails: protectedProcedure.query(async ({ ctx }) => {
    const tradingAccountId = (await getTradingAccount(ctx)).id;
    const usdtBalance = await ctx.db.assets.findUnique({
      where: {
        unique_TradingAccountId_name: {
          TradingAccountId: tradingAccountId,
          name: "USDT",
        },
      },
    });
    return {
      usdtBalance: (usdtBalance ? usdtBalance.freeAmount + usdtBalance.lockedAmount : 0).toFixed(2),
      ...(await getCurrentPositionDetails(
        (await getOpenPositions({ db: ctx.db, tradingAccountId })).map((i) => ({
          ...i.PositionDetails,
          name: i.name,
        })),
      )),
    };
  }),
});
