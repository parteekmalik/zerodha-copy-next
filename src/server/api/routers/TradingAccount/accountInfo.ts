import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getTradingAccount } from "../Trades/utils/getTradingAccount";

export const getAccountInfoRouter = createTRPCRouter({
  getInitInfo: protectedProcedure.query(async ({ ctx }) => {
    const data = await getTradingAccount(ctx);

    if (data) {
      const { watchList, Pin0, Pin1, id } = data;
      return {
        userInfo: { ...ctx.session.user, TradingAccountId: id },
        watchList: convert1D_2D(watchList),
        Pins: { Pin0: Pin0, Pin1: Pin1 },
        WalletBalances: data.Assets,
      };
    }
  }),
  getAllBalance: protectedProcedure.query(async ({ ctx }) => {
    return (await getTradingAccount(ctx)).Assets;
  }),
});

export function convert1D_2D(input: string[]): string[][] {
  const watchlistFinal: string[][] = [];
  input?.map((symbol) => {
    watchlistFinal.push(
      symbol.split(" ").filter((x) => {
        if (x !== "") return x;
      }),
    );
  });
  return watchlistFinal;
}
