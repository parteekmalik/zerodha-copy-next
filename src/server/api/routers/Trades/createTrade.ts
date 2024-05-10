import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import getLTP from "~/components/zerodha/OrderForm/getLTP";
import getBaseAssetDetails from "./utils/getBaseAssetDetails";

// TODO: add logic for limit orders (add lockedBalance)
export default async function createOrderTransection(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: {
    orderType: "BUY" | "SELL";
    trigerType: "LIMIT" | "STOP" | "MARKET";
    quantity: number;
    price: number;
    sl: number;
    tp: number;
    symbolName: string;
    marketType: "SPOT" | "MARGIN";
  },
  Taccounts: {
    id: string;
  },
) {
  const transection = await db.$transaction(async (tx) => {
    const BaseAssetName = input.symbolName.slice(0, -4).toUpperCase();

    const assets = (
      await tx.tradingAccount.findUnique({
        where: { id: Taccounts.id },
        select: { TradeAssets: { include: { Trades: true } } },
      })
    )?.TradeAssets;

    const USDT_Free_balance = (
      await tx.tradingAccount.findUnique({
        where: { id: Taccounts.id },
        select: { USDT_Free_balance: true },
      })
    )?.USDT_Free_balance;
    if (!USDT_Free_balance || !assets) {
      return "order creation transection failed";
    }

    const BaseAssetDetails = await getBaseAssetDetails(
      tx,
      assets,
      Taccounts.id,
      BaseAssetName,
    );
    if (!BaseAssetDetails) return "server unexpected error";

    const curPrice = await getLTP(input.symbolName);
    const requiredBalaceForOrder =
      (input.trigerType === "MARKET" ? curPrice : input.price) * input.quantity;

    if (USDT_Free_balance < requiredBalaceForOrder) {
      return "INsuffficient balance";
    }

    const CreatedTrade = await tx.trades.create({
      data: {
        name: input.symbolName,
        type: input.orderType,
        status: input.trigerType === "MARKET" ? "FILLED" : "PENDING",
        triggerType: input.trigerType,
        openPrice: input.trigerType === "MARKET" ? curPrice : input.price,
        quantity: input.quantity,
        TradingAccountId: Taccounts.id,
        tradeAssetsId: BaseAssetDetails.id,
      },
    });
    
    if (input.trigerType === "MARKET") {
      await tx.tradeAssets.update({
        where: { id: BaseAssetDetails.id },
        data: {
          freeAmount: {
            increment: input.quantity,
          },
        },
      });

      await tx.tradingAccount.update({
        where: { id: Taccounts.id },
        data: {
          USDT_Free_balance: {
            decrement: input.quantity * curPrice,
          },
        },
      });
    } else {
      await tx.tradingAccount.update({
        where: { id: Taccounts.id },
        data: {
          USDT_Locked_balance: {
            increment: input.quantity * input.price,
          },
          USDT_Free_balance: {
            decrement: input.quantity * input.price,
          },
        },
      });
    }
    //complete transection

    return CreatedTrade;
  });
  return transection;
}
