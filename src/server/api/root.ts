import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { accountInfoRouter } from "./routers/accountInfo";
import { orderRouter } from "./routers/orders";
import { SymbolList } from "./routers/symbolList";
import { updateAcoount } from "./routers/updateAcoount";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  accountInfo: accountInfoRouter,
  orders: orderRouter,
  symbolList: SymbolList,
  updateAcoount: updateAcoount,
});

// export type definition of API
export type AppRouter = typeof appRouter;
