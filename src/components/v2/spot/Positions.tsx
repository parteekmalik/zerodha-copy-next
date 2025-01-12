import React from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "~/components/v2/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/v2/ui/table";
import { Badge } from "~/components/v2/ui/badge";
import usePositions from "~/components/v2/hooks/usePositions";
import { X } from "lucide-react";
import { Button } from "~/components/v2/ui/button";
import { useChart } from "~/components/v2/contexts/chartContext";
import useCreateOrderApi from "~/components/zerodha/_hooks/API/useCreateOrderApi";
import { ScrollArea } from "~/components/v2/ui/scroll-area";

function Positions({ className }: { className?: string }) {
  const positions = usePositions();
  const { setSymbolSelected } = useChart();

  const handleClosePosition = (position: {
    id: string;
    name: string;
    quantity: string;
    avgPrice: string;
    totalPrice: number;
    currentTotalPrice: number;
    LTP: string | undefined;
    "P&L": string;
    change: string;
  }) => {
    const order = {
      orderType: Number(position.quantity) ? ("SELL" as const) : ("BUY" as const),
      quantity: Number(position.quantity),
      trigerType: "MARKET" as const,
      price: 0,
      symbolName: position.name,
      marketType: "SPOT" as const,
    };
    CreateOrderAPI.mutate(order);
    console.log(`Closing position with ID: ${position.id}`);
  };
  const { CreateOrderAPI } = useCreateOrderApi();

  return (
    <Card className={twMerge("mb-1 grow-[3] border-border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Avg Price</TableHead>
            <TableHead className="text-right">LTP</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.PositionsList?.map((position, index) => (
            <TableRow key={index} onClick={() => setSymbolSelected(position.name)}>
              <TableCell className="font-medium">{position.name}</TableCell>
              <TableCell className="text-right">{position.quantity}</TableCell>
              <TableCell className="text-right">{position.avgPrice}</TableCell>
              <TableCell className="text-right">{position.LTP}</TableCell>
              <TableCell className="text-right">
                <Badge variant={Number(position["P&L"]) >= 0 ? "success" : "destructive"}>{position["P&L"]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={Number(position.change) >= 0 ? "success" : "destructive"}>{position.change}%</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePosition(position);
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {positions.PositionsList.length ? (
          <TableFooter>
            <TableRow>
              <TableCell className="font-medium" colSpan={3}></TableCell>
              <TableCell className="text-right font-medium">Total</TableCell>
              <TableCell className="text-right">
                <Badge variant={positions.PositionsTotal?.["P&L"] >= 0 ? "success" : "destructive"}>
                  {positions.PositionsTotal?.["P&L"].toFixed(2)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={positions.PositionsTotal?.change >= 0 ? "success" : "destructive"}>
                  {positions.PositionsTotal?.change.toFixed(2)}%
                </Badge>
              </TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </Card>
  );
}

export default Positions;
