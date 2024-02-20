import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { orderRouter } from "./routers/orercreate";
import { accountInfoRouter } from "./routers/accountInfo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  order: orderRouter,
  accountInfo: accountInfoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
