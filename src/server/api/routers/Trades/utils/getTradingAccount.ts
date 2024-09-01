import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { JWT } from "next-auth/jwt";
import { db } from "~/server/db";
import createTradingAccount from "./createTradingAccount";

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
  let Taccounts = (
    await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        Taccounts: { include: { Assets: true } },
      },
    })
  )?.Taccounts;

  if (!Taccounts) {
    Taccounts = await createTradingAccount(db, ctx.session.user.id);
    console.log("creating trading account -> ", Taccounts);
  }
  return Taccounts;
}
