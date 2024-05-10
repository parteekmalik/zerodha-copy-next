import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { SymbolList } from "./routers/symbolList";
import { TradesRouter } from "./routers/Trades/Trades";
import { getAccountInfoRouter } from "./routers/TradingAccount/accountInfo";
import { updateAccountInfoRouter } from "./routers/TradingAccount/UpdateaccountInfo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  getAccountInfo: getAccountInfoRouter,
  upadteAccountInfo: updateAccountInfoRouter,
  Trades: TradesRouter,
  symbolList: SymbolList,
});

// export type definition of API
export type AppRouter = typeof appRouter;
