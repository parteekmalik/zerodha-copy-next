import TsMap from "ts-map";
import {
  TOrder,
  TorderDetails,
  calTotalPrice,
  divdeIntoClosedOpen,
  divideIntoBUYSELL,
} from "./utils";
import { sumByKey } from "../divideOrders";

class OrderCalculations {
  public BuyQuantity = 0;
  public BuyPriceTotal = 0;
  public SellQuantity = 0;
  public SellPriceTotal = 0;
  public Profit = () => this.SellPriceTotal - this.BuyPriceTotal;
  public Net_quantity = () => this.BuyQuantity - this.SellQuantity;

  constructor(buyTrades: TorderDetails[], sellTrades: TorderDetails[]) {
    this.BuyQuantity = sumByKey(buyTrades, "quantity");
    this.SellQuantity = sumByKey(sellTrades, "quantity");
    this.BuyPriceTotal = calTotalPrice(buyTrades);
    this.BuyPriceTotal = calTotalPrice(sellTrades);
  }
}

export default class OrdersManage {
  public dummy = "dummy";
  private orders: TOrder[] = [];
  private orderDetailsMap = new TsMap<
    string,
    { open: OrderCalculations; close: OrderCalculations }
  >();

  constructor(orders: TOrder[]) {
    this.orders = orders;

    this.orderDetailsMap = this.fillorderDetailsMap();
    // printMap(this.orderDetailsMap);
  }

  private fillorderDetailsMap() {
    console.log("filling orderDetailsMap");

    const orderMap = fillOrderMap(this.orders);
    const orderDetailsMap = new TsMap<
      string,
      { open: OrderCalculations; close: OrderCalculations }
    >();
    orderMap.forEach((value, key, map) => {
      if (key && value && map) {
        const { buyList, sellList } = divideIntoBUYSELL(value);
        const res = divdeIntoClosedOpen([...buyList], [...sellList]);
        orderDetailsMap.set(key, {
          open: new OrderCalculations(res.openTrades, []),
          close: new OrderCalculations(
            res.ClosedTrades.buyTrades,
            res.ClosedTrades.sellTrades,
          ),
        });
      }
    });
    return orderDetailsMap;
  }
}
function printMap(map: TsMap<string, unknown>) {
  map.forEach((value, key, map) => {
    if (key && value && map) {
      console.log(key, " : ", value);
    }
  });
}
function fillOrderMap(orders: TOrder[]) {
  const orderMap = new TsMap<string, TorderDetails[]>();
  orders.map((item) => {
    const order: TorderDetails = {
      type: item.type,
      quantity: item.quantity,
      price: item.price,
    };
    if (orderMap.get(item.name)) orderMap.get(item.name)?.push(order);
    else orderMap.set(item.name, [order]);
  });
  return orderMap;
}
