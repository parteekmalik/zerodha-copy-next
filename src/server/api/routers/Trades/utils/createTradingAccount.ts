import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import createAsset from "./createAsset";

const createTradingAccount = async (
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  userId: string,
) => {
  return await db.$transaction(async (tx) => {
    const res = await tx.tradingAccount.create({
      data: {
        User: { connect: { id: userId } },
      },
    });
    const usdtAsset = await createAsset(tx, res.id, 100000, "USDT");
    return { ...res, Assets: [usdtAsset] };
  });
};
export default createTradingAccount;
