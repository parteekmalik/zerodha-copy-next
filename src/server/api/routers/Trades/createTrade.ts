import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import getLTP from "~/components/zerodha/OrderForm/getLTP";
import createAsset from "./utils/createAsset";

// TODO: add logic for limit orders (add lockedBalance)
type createOrderInterface = {
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  input: {
    orderType: "BUY" | "SELL";
    trigerType: "LIMIT" | "STOP" | "MARKET";
    quantity: number;
    price: number;
    symbolName: string;
    marketType: "SPOT" | "MARGIN";
  };
  Taccount: string;
};
export default async function createOrderTransection({ db, input, Taccount }: createOrderInterface) {
  const BaseAssetName = input.symbolName.slice(0, -4).toUpperCase();
  const baseAsset =
    (await db.assets.findUnique({
      where: {
        unique_TradingAccountId_name: {
          TradingAccountId: Taccount,
          name: BaseAssetName,
        },
      },
    })) ?? (await createAsset(db, Taccount, 0, BaseAssetName));

  const usdtAsset =
    (await db.assets.findUnique({
      where: {
        unique_TradingAccountId_name: {
          TradingAccountId: Taccount,
          name: "USDT",
        },
      },
    })) ?? (await createAsset(db, Taccount, 100000, "USDT"));

  const price = input.trigerType === "MARKET" ? await getLTP(baseAsset.name) : input.price;
  if (typeof price !== "number" || !usdtAsset) return { error: "server error", price, usdtAsset };

  const isBuyOrder = input.orderType === "BUY";
  const requiredBalaceForOrder = isBuyOrder ? price * input.quantity : input.quantity;
  const BalsnceAvailable = isBuyOrder ? usdtAsset.freeAmount : baseAsset.freeAmount;
  if (BalsnceAvailable < requiredBalaceForOrder)
    return "insufficent asset available:" + BalsnceAvailable + " required: " + requiredBalaceForOrder;

  return db.$transaction(async (tx) => {
    if (input.trigerType !== "MARKET")
      await tx.assets.update({
        where: {
          unique_TradingAccountId_name: {
            TradingAccountId: Taccount,
            name: isBuyOrder ? usdtAsset.name : baseAsset.name,
          },
        },
        data: {
          freeAmount: {
            decrement: requiredBalaceForOrder,
          },
          lockedAmount: {
            increment: requiredBalaceForOrder,
          },
        },
      });
    else {
      const data = {
        asset: {
          [isBuyOrder ? "increment" : "decrement"]: input.quantity,
        },
        usdt: {
          [isBuyOrder ? "decrement" : "increment"]: input.quantity * price,
        },
      };

      await tx.assets.update({
        where: {
          unique_TradingAccountId_name: {
            TradingAccountId: Taccount,
            name: baseAsset.name,
          },
        },
        data: { freeAmount: data.asset },
      });
      await tx.assets.update({
        where: {
          unique_TradingAccountId_name: {
            TradingAccountId: Taccount,
            name: usdtAsset.name,
          },
        },
        data: { freeAmount: data.usdt },
      });
    }
    return await tx.order.create({
      data: {
        price,
        type: input.orderType,
        triggerType: input.trigerType,
        name: input.symbolName,
        quantity: input.quantity,
        status: input.trigerType === "MARKET" ? "COMPLETED" : "OPEN",
        TradingAccountId: Taccount,
        AssetsId: baseAsset.id,
      },
    });
  });
}
