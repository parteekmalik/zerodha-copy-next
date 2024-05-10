import { Prisma, PrismaClient, TradeAssets } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export default async function getBaseAssetDetails(
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  Assets: TradeAssets[],
  Taccounts: string,
  BaseAssetName: string,
) {
  const BaseAssetDetails = Assets.filter((i) => i.name === BaseAssetName)[0];
  if (!BaseAssetDetails) {
    await tx.tradeAssets.create({
      data: {
        name: BaseAssetName,
        freeAmount: 0,
        TradingAccountId: Taccounts,
      },
    });
  }
  return await tx.tradeAssets.findFirst({
    where: { name: BaseAssetName, TradingAccountId: Taccounts },
    include: { Trades: true },
  });
}
