"use client";
import { ReactNode, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { FadedColoredCell } from "~/components/zerodha/Table/cellStyledComponents";
import {
  coloredColsType,
  FundsRow,
  GridColDef,
  TableDefaultstyles,
} from "~/components/zerodha/Table/defaultStylexAndTypes";
import DataGrid from "~/components/zerodha/Table/table";
import { api } from "~/trpc/react";

const shadowBox = " shadow-[0_0_5px_0_rgba(0,0,0,.1)] ";

function Funds() {
  const data = api.getAccountInfo.getAllBalance.useQuery().data ?? [];
  const FundsList: FundsRow[] = useMemo(() => {
    return data.map((item) => ({
      ...item,
      widrawal: "widrawal",
      deposit: "deposit",
    }));
  }, [data]);
  const FundsGridColumn: GridColDef<(typeof FundsList)[0]>[] = [
    { headerName: "name", field: "name", width: 0 },
    { headerName: "freeAmount", field: "freeAmount", width: 0 },
    { headerName: "lockedAmount", field: "lockedAmount", width: 0 },
    { headerName: "deposit", field: "deposit", width: 0 },
    { headerName: "widrawal", field: "widrawal", width: 0 },
  ];
  const handleFn = (ids: (string | number)[]) => {
    // Placeholder function for handling selection
    console.log("submitted: ", ids);
  };
  return (
    <div className="w-full">
      <DataGrid<FundsRow>
        rows={FundsList}
        columns={FundsGridColumn}
        coloredCols={colorColsData as coloredColsType<FundsRow>}
        styles={TableDefaultstyles}
      />
    </div>
  );
}
export default Funds;
const colorColsData = [
  {
    name: "widrawal",
    fn: (value: unknown, styles: string) => {
      const text = value as string;
      const component = (
        <FadedColoredCell
          text={text}
          bgColor={"bg-redApp"}
          textColor={"text-redApp"}
        />
      );
      const restult: [ReactNode, string] = [component, twMerge(styles, "")];
      return restult;
    },
  },
  {
    name: "deposit",
    fn: (value: unknown, styles: string) => {
      const text = value as string;
      const component = (
        <FadedColoredCell
          text={text}
          bgColor={"bg-blueApp "}
          textColor={"text-blueApp "}
        />
      );
      const restult: [ReactNode, string] = [component, twMerge(styles, "")];
      return restult;
    },
  },
];
