import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

// TODO: add logic for limit orders (add lockedBalance)
export default async function USDTBalance(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: {
    account: string;
    amount: number;
  },
) {
  const transection = await db.$transaction(async (tx) => {
    const account = await tx.tradingAccount.findFirst({
      where: { id: input.account },
    });

    if (!account) {
      return "ACCount not found";
    }

    const newBalance = account.USDT_Free_balance + input.amount;

    if (newBalance < 0) {
      return "Insufficient funds";
    }

    const updatedAccount = await tx.tradingAccount.update({
      where: { id: account.id },
      data: { USDT_Free_balance: newBalance },
    });
    return updatedAccount;
  });
  return transection;
}
