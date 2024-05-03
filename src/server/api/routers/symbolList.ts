import { symbolList } from "public/symbolname";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const SymbolList = createTRPCRouter({
  getSymbolList: protectedProcedure.query(({}) => {
    return symbolList;
  }),
});
