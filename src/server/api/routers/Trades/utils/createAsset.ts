import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

const createAsset = async (
  db:
    | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
  Taccountid: string,
  freeAmount: number,
  name: string,
) => {
  return await db.assets.create({
    data: {
      name,
      freeAmount,
      TradingAccountId: Taccountid,
    },
  });
};
export default createAsset;
