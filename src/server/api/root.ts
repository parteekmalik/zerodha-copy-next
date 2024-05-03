import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { orderRouter } from "./routers/Orders/orders";
import { SymbolList } from "./routers/symbolList";
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
  orders: orderRouter,
  symbolList: SymbolList,
});

// export type definition of API
export type AppRouter = typeof appRouter;
