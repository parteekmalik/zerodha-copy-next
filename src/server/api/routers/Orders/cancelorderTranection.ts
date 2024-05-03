import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import TsMap from "ts-map";

// TODO: add logic for limit orders (add lockedBalance)
export default async function cancelOrderTranection(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: string[],
  Taccounts: string,
) {
  const transection = await db.$transaction(async (tx) => {
    const Assets = await tx.assets.findMany({
      where: { TradingAccountId: Taccounts },
      include: {
        Orders: true,
      },
    });

    // TODO: cal amount to be released and store in variable

    const data = new TsMap<string, number>();
    Assets.filter((i) => i.name !== "USDT").map((value) => {
      value.Orders.filter((i) => i.status === "open").map((order) => {
        if (order.type === "BUY") {
          data.set(
            "USDT",
            (data.get("USDT") ?? 0) + order.quantity * order.price,
          );
          console.log(value.name, "BUY", order);
        } else {
          console.log(value.name, "SELL", order);

          data.set(value.name, (data.get(value.name) ?? 0) + order.quantity);
        }
      });
    });

    //complete transection
    const res = await tx.orders.updateMany({
      where: {
        id: { in: input },
        TradingAccountId: Taccounts,
      },
      data: {
        status: "cancelled",
      },
    });
    console.log("canceling data ->", data);
    await Promise.all(
      data.entries().map(async ([name, amount]) => {
        await tx.assets.update({
          where: {
            unique_TradingAccountId_name: { TradingAccountId: Taccounts, name },
            TradingAccountId: Taccounts,
            name,
          },
          data: {
            freeAmount: {
              increment: amount,
            },
            lockedAmount: {
              decrement: amount,
            },
          },
        });
      }),
    );
    return res;
  });
  return transection;
}
