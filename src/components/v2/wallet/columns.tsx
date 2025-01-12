"use client";

import { Button } from "~/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { type FundsRow } from "~/components/v2/wallet/defaultStylexAndTypes";
import { ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "~/components/zerodha/_redux/store";

function CoinName({coinName}:{coinName:string}) {
  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  return (
    <div className="text-center">
      {coinName} ({coinName === "USDT" ? "Tether" : symbolsList[coinName + "USDT"]?.name})
    </div>
  );
}
export const columns: ColumnDef<FundsRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Coin
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <CoinName coinName={row.getValue("name")}/>
    },
  },
  {
    accessorKey: "freeAmount",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Free
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = Number(row.getValue("freeAmount"));
      return <div className="text-center">{amount?.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "lockedAmount",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Locked
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = Number(row.getValue("lockedAmount"));
      return <div className="text-center">{amount?.toFixed(2)}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const fund = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Button
            className="text-white"
            size="sm"
            onClick={() => {
              // Handle deposit
            }}
          >
            {fund.deposit}
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            size="sm"
            onClick={() => {
              // Handle withdrawal
            }}
          >
            {fund.widrawal}
          </Button>
          <Button
            variant="outline"
            className="text-white"
            size="sm"
            onClick={() => {
              // Handle history
            }}
          >
            {fund.history}
          </Button>
        </div>
      );
    },
  },
];
