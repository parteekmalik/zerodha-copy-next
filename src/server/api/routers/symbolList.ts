import { symbolList } from "public/symbolname";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const SymbolList = createTRPCRouter({
  getSymbolList: protectedProcedure.query(({ ctx }) => {
    return symbolList;
  }),
});
