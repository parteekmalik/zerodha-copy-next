import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { JWT } from "next-auth/jwt";

export async function getTradingAccount(ctx: {
  session: {
    user: {
      id: string;
      token: JWT;
    } & {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
    expires: string;
  };
  headers: Headers;
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}) {
  const Taccounts = (
    await ctx.db.user.findFirst({
      where: { name: ctx.session.user.name },
      select: {
        Taccounts: true,
      },
    })
  )?.Taccounts[0];
  console.log("checking trading account -> ", Taccounts);

  if (!Taccounts) {
    return await ctx.db.tradingAccount.create({
      data: {
        User: { connect: { id: ctx.session.user.id } },
      },
    });
  } else return Taccounts;
}
