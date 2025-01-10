"use client";

import { Button } from "~/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { type FundsRow } from "~/components/zerodha/Table/defaultStylexAndTypes";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<FundsRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Coin
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "freeAmount",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
        </div>
      );
    },
  },
]; 