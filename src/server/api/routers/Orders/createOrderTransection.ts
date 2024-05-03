import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import getLTP from "~/components/zerodha/OrderForm/getLTP";
import { TOrder } from "~/components/zerodha/Rightside/Order";
import { sumByKey } from "~/lib/zerodha/utils";

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
        select: { Assets: { include: { Orders: true } } },
      })
    )?.Assets;

    const QuoteAssetDetails = assets?.filter((i) => i.name === "USDT")[0];
    if (!QuoteAssetDetails || !assets) {
      return "order creation transection failed";
    }

    const QuoteAssetBalance = QuoteAssetDetails.freeAmount;

    const getBaseAssetDetails = async (Assets: typeof assets) => {
      const BaseAssetDetails = Assets.filter(
        (i) => i.name === BaseAssetName,
      )[0];
      if (!BaseAssetDetails) {
        await tx.assets.create({
          data: {
            name: BaseAssetName,
            freeAmount: 0,
            TradingAccountId: Taccounts.id,
          },
        });
      }
      return await tx.assets.findFirst({
        where: { name: BaseAssetName, TradingAccountId: Taccounts.id },
        include: { Orders: true },
      });
    };
    const BaseAssetDetails = await getBaseAssetDetails(assets);
    if (!BaseAssetDetails) return "server unexpected error";
    const requiredBalaceForOrder =
      input.orderType === "BUY"
        ? (input.trigerType === "MARKET"
            ? await getLTP(input.symbolName)
            : input.price) * input.quantity
        : input.quantity;

    if (
      input.orderType === "BUY" &&
      QuoteAssetBalance < requiredBalaceForOrder
    ) {
      return "INsuffficient balance";
    }
    if (
      input.orderType === "SELL" &&
      requiredBalaceForOrder > BaseAssetDetails.freeAmount
    ) {
      return "INsuffficient Assets";
    }

    let CreatedOrder: TOrder;
    if (input.trigerType === "MARKET") {
      const curPrice = await getLTP(input.symbolName);
      if (!curPrice) return "server error(cant get price from binance api)";
      CreatedOrder = await tx.orders.create({
        data: {
          name: input.symbolName,
          type: input.orderType,
          status: "completed",
          triggerType: input.trigerType,
          price: curPrice,
          quantity: input.quantity,
          TradingAccountId: Taccounts.id,
          AssetsId: BaseAssetDetails.id,
        },
      });
      await tx.assets.update({
        where: { id: BaseAssetDetails.id },
        data: {
          freeAmount: {
            increment: input.quantity * (input.orderType === "SELL" ? -1 : 1),
          },
        },
      });

      await tx.assets.update({
        where: { id: QuoteAssetDetails.id },
        data: {
          freeAmount: {
            increment:
              input.quantity * curPrice * (input.orderType !== "SELL" ? -1 : 1),
          },
        },
      });
      const updateAvgBuyPrice = async (Taccountsid: string) => {
        const orders = (
          await tx.assets.findUnique({
            where: { id: Taccountsid },
            select: { Orders: { where: { status: "completed" } } },
          })
        )?.Orders;
        if (orders) {
          const avgPrice = CalAvgBuyPrice(orders);
          console.log(avgPrice, typeof avgPrice);
          await tx.assets.update({
            where: { id: Taccountsid },
            data: {
              AvgPrice: avgPrice,
            },
          });
        } else {
          return "unecptedd error";
        }
      };
      await updateAvgBuyPrice(BaseAssetDetails.id);
    } else {
      CreatedOrder = await tx.orders.create({
        data: {
          name: input.symbolName,
          type: input.orderType,
          status: "open",
          triggerType: input.trigerType,
          price: input.price,
          quantity: input.quantity,
          TradingAccountId: Taccounts.id,
          AssetsId: BaseAssetDetails.id,
        },
      });
      if (input.orderType === "BUY") {
        await tx.assets.update({
          where: { id: QuoteAssetDetails.id },
          data: {
            lockedAmount: {
              increment: input.quantity * input.price,
            },
            freeAmount: {
              decrement: input.quantity * input.price,
            },
          },
        });
      } else {
        await tx.assets.update({
          where: { id: BaseAssetDetails.id },
          data: {
            lockedAmount: {
              increment: input.quantity,
            },
            freeAmount: {
              decrement: input.quantity,
            },
          },
        });
      }
    }
    //complete transection

    return CreatedOrder;
  });
  return transection;
}
function CalAvgBuyPrice(orders: TOrder[]) {
  // TODO :finish function

  orders = orders.filter((i) => i.status === "completed");

  const { buyList, sellList } = seprateIntoBUYSELL(orders);
  const openOrders = extractOpenTrades(buyList, sellList);
  const avgPrice = avgBuyPrice(openOrders);
  return Number.isNaN(avgPrice) ? 0 : avgPrice;
}
function seprateIntoBUYSELL(Trades: TOrder[]) {
  const buyList = Trades.filter((i) => i.type === "BUY");
  const sellList = Trades.filter((i) => i.type === "SELL");
  return { buyList, sellList };
}
function extractOpenTrades(BuyTrades: TOrder[], SellTrades: TOrder[]) {
  let skipQuantity = sumByKey(SellTrades, "quantity");
  let isSkipped = false;
  const OpenTradeList: TOrder[] = [];
  BuyTrades.forEach((value, index, array) => {
    if (isSkipped) OpenTradeList.push(value);
    else {
      skipQuantity -= value.quantity;
      if (skipQuantity < 0) {
        value.quantity = skipQuantity * -1;
        OpenTradeList.push(value);
        isSkipped = true;
      } else if (0 === skipQuantity) {
        isSkipped = true;
      }
    }
  });
  return OpenTradeList;
}
function avgBuyPrice(orders: TOrder[]) {
  const TotalQuantity = sumByKey(orders, "quantity");
  let TotalBuyPrice = 0;
  orders.map((value) => {
    TotalBuyPrice += value.quantity * value.price;
  });
  return TotalBuyPrice / TotalQuantity;
}
