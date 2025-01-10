"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/v2/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/v2/ui/table";
import { Badge } from "~/components/v2/ui/badge";
import { formatDistance } from "date-fns";
import useOrder, { type TclosedOrder, type TopenOrder } from "~/components/v2/hooks/useOrder";

export default function OrderBook({ filterFor }: { filterFor?: string }) {
  const { openOrders, closedOrders } = useOrder(filterFor);

  return (
    <Tabs defaultValue="open" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="open">Open Orders</TabsTrigger>
        <TabsTrigger value="closed">Closed Orders</TabsTrigger>
      </TabsList>
      <TabsContent value="open">
        <OrderTable orders={openOrders} orderType="OPEN" />
      </TabsContent>
      <TabsContent value="closed">
        <OrderTable orders={closedOrders} orderType="CLOSED" />
      </TabsContent>
    </Tabs>
  );
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "OPEN":
      return "bg-yellow-500";
    case "CANCELLED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const OrderTable = ({ orders, orderType }: { orders: TopenOrder[] | TclosedOrder[]; orderType: "OPEN" | "CLOSED" }) => (
  <Table>
    <TableHeader className="[&_tr]:border-border">
      <TableRow>
        <TableHead>Type</TableHead>
        <TableHead>Symbol</TableHead>
        <TableHead>Quantity</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>{orderType === "OPEN" ? "LTP" : null}</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Time</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="[&_tr:last-child]:border-border">
      {orders.map((order, index) => (
        <TableRow key={index} className="border-border">
          <TableCell>
            <Badge variant={order.type === "BUY" ? "default" : "destructive"}>{order.type}</Badge>
          </TableCell>
          <TableCell>{order.name}</TableCell>
          <TableCell>{order.quantity}</TableCell>
          <TableCell>${order.price.toLocaleString()}</TableCell>
          <TableCell>{orderType === "OPEN" ? (order as TopenOrder).LTP : null}</TableCell>
          <TableCell>
            <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
          </TableCell>
          <TableCell>
            {formatDistance(new Date(order.openedAt), new Date(), {
              addSuffix: true,
            })}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
