import { createTRPCRouter } from "~/server/api/trpc";
import { SymbolList } from "./routers/symbolList";
import { OrderRouter } from "./routers/Trades/Order";
import { getAccountInfoRouter } from "./routers/TradingAccount/accountInfo";
import { updateAccountInfoRouter } from "./routers/TradingAccount/UpdateaccountInfo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  getAccountInfo: getAccountInfoRouter,
  upadteAccountInfo: updateAccountInfoRouter,
  Order: OrderRouter,
  symbolList: SymbolList,
});

// export type definition of API
export type AppRouter = typeof appRouter;
