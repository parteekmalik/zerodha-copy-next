"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import { type FundsRow } from "~/components/zerodha/Table/defaultStylexAndTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Icons } from "~/components/icons";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function Page() {
  const { data: queryData, isLoading } = api.getAccountInfo.getAllBalance.useQuery();
  const data = useMemo(() => queryData ?? [], [queryData]);
  const FundsList: FundsRow[] = useMemo(() => {
    return data.map((item) => ({
      ...item,
      widrawal: "Withdraw",
      deposit: "Deposit",
    }));
  }, [data]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Your total available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <Icons.spinner className="h-6 w-6 animate-spin" />
              ) : (
                `$${FundsList.reduce((acc, item) => acc + (item.freeAmount ?? 0), 0).toFixed(2)}`
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balance History</CardTitle>
          <CardDescription>View your balance across different currencies</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <DataTable columns={columns} data={FundsList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
