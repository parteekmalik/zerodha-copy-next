import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

import { TOrder } from "../Order";

function Positions() {
  const ordersQuery = api.orders.getOrders24hr.useQuery();

  const [orderMap, setorderMap] = useState(new OrdersManage([]));


  if (typeof ordersQuery.data === "string") return <>{ordersQuery}</>;
  return (
    <>
      <div className="w-full bg-white">hi</div>
    </>
  );
}

export default Positions;
class OrdersManage {
  private orders: TOrder[] = [];

  constructor(orders: TOrder[]) {
    this.orders = orders;

    // printMap(this.orderDetailsMap);
    console.log("filling orderDetailsMap");
  }
}
