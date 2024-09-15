import { $Enums } from "@prisma/client";
import { ReactNode } from "react";

export interface DataGridStyles {
  table?: { className?: string };
  head?: {
    className?: string;
    row?: string;
    cell?: string;
  };
  body?: {
    className?: string;
    row?: string;
    cell?: string;
  };
  footer?: {
    className?: string;
    button?: string;
  };
  checkbox?: string;
}

export const TableDefaultstyles: DataGridStyles = {
  table: {
    className: "w-full  ",
  },
  head: {
    className: "opacity-50 text-sm  ",
    row: "border-y-[1px] border-borderApp ",
    cell: "p-3   font-thin",
  },
  body: {
    className: "text-textDark",
    row: "border-b-[1px] border-borderApp",
    cell: "p-3 text-center uppercase  font-thin ",
  },
  footer: {
    button: "bg-blueApp text-white my-3 px-2 rounded-md",
  },
  checkbox: "text-center",
};

// Correct type definition for GridColDef using keyof
export type GridColDef<T> = {
  headerName: string;
  field: keyof T;
  width?: number;
};

export type PositionRow = {
  id: string;
  name: string;
  quantity: number | string;
  avgPrice: number| string;
  totalPrice: number| string;
  LTP: string | undefined| string;
  "P&L": string;
  change: string;
};
export type FundsRow = {
  id: string;
  name: string;
  freeAmount: number;
  lockedAmount: number;
  widrawal: string;
  deposit: string;
};

export type OrderClosedRow = {
  name: string;
  id: number;
  openedAt: string;
  quantity: string;
  price: number;
  type: $Enums.OrderType;
  status: $Enums.OrderStatus;
};

export interface OrderOpenRow extends OrderClosedRow {
  LTP: string | undefined;
}

export type RowType = PositionRow | OrderOpenRow | OrderClosedRow | FundsRow;

// Define the props for the DataGrid component
export interface DataGridProps<T extends RowType> {
  rows: T[];
  styles?: DataGridStyles;
  columns: GridColDef<T>[];
  footer?: {
    "P&L": number;
    LTP: string;
    skip: number;
  };
  coloredCols?: coloredColsType<T>;
  selected?: { handleFn: (selectedIds: T[]) => void; text: string }; // Update the type of selected to accept an array of IDs
}

export type coloredColsType<T> = {
  name: keyof T;
  fn: (value: unknown, styles: string) => [string | ReactNode, string];
}[];
