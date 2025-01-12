"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/v2/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/v2/ui/table";
import { Badge } from "~/components/v2/ui/badge";
import { formatDistance } from "date-fns";
import useOrder, { type TclosedOrder, type TopenOrder } from "~/components/v2/hooks/useOrder";
import { useCancelOrders } from "~/components/v2/hooks/usecancelOrders";
import { Button } from "~/components/v2/ui/button";
import { X } from "lucide-react";
import Positions from "./Positions";
import { Card } from "~/components/v2/ui/card";
import { CardContent } from "~/components/v2/ui/card";
import { ScrollArea } from "~/components/v2/ui/scroll-area";

export default function OrderBook({ filterFor }: { filterFor?: string }) {
  const { openOrders, closedOrders } = useOrder(filterFor);
  const { cancelOrdersAPI } = useCancelOrders();
  const handleCloseOrder = (orderId: number) => {
    cancelOrdersAPI.mutate({ orderids: orderId });
  };

  return (
    <Card className="mt-1 h-1/4 ">
      <CardContent className="h-full p-3">
        <Tabs defaultValue="positions" className="flex h-full w-full flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="open">Open Orders</TabsTrigger>
            <TabsTrigger value="closed">Closed Orders</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-full pr-1">
            <TabsContent value="positions">
              <Positions />
            </TabsContent>
            <TabsContent value="open">
              <OrderTable handleCloseOrder={handleCloseOrder} orders={openOrders} orderType="OPEN" />
            </TabsContent>
            <TabsContent value="closed">
              <OrderTable orders={closedOrders} orderType="CLOSED" />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-700 text-white";
    case "OPEN":
      return "bg-yellow-700 text-white";
    case "CANCELLED":
      return "bg-red-700 text-white";
    default:
      return "bg-gray-700";
  }
};

const OrderTable = ({
  orders,
  orderType,
  handleCloseOrder,
}: {
  handleCloseOrder?: (orderId: number) => void;
  orders: TopenOrder[] | TclosedOrder[];
  orderType: "OPEN" | "CLOSED";
}) => {
  return (
    <Table>
      <TableHeader className="[&_tr]:border-border">
        <TableRow>
          <TableHead className="text-center">Type</TableHead>
          <TableHead className="text-center">Symbol</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead className="text-center">{orderType === "OPEN" ? "LTP" : null}</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Time</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr:last-child]:border-border">
        {orders.map((order, index) => (
          <TableRow key={index} className="border-border">
            <TableCell className="text-center">
              <Badge variant={order.type === "BUY" ? "default" : "destructive"}>{order.type}</Badge>
            </TableCell>
            <TableCell className="text-center">{order.name}</TableCell>
            <TableCell className="text-center">{order.quantity}</TableCell>
            <TableCell className="text-center">${order.price.toLocaleString()}</TableCell>
            <TableCell className="text-center">{orderType === "OPEN" ? (order as TopenOrder).LTP : null}</TableCell>
            <TableCell className="text-center">
              <Badge className={`${getStatusColor(order.status)}`}>{order.status}</Badge>
            </TableCell>
            <TableCell className="text-center">
              {formatDistance(new Date(order.openedAt), new Date(), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell className="text-center">
              {orderType === "OPEN" && (
                <Button variant="destructive" size="icon" onClick={() => handleCloseOrder && handleCloseOrder(order.id)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
