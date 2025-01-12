"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import { type FundsRow } from "~/components/zerodha/Table/defaultStylexAndTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Icons } from "~/components/icons";
import { columns } from "~/components/v2/wallet/columns";
import { DataTable } from "~/components/v2/wallet/data-table";

function Page() {
  const { data: queryData, isLoading } = api.getAccountInfo.getAllBalance.useQuery();
  const data = useMemo(() => queryData ?? [], [queryData]);
  const FundsList: FundsRow[] = useMemo(() => {
    return data.map((item) => ({
      ...item,
      widrawal: "Withdraw",
      deposit: "Deposit",
      history: "History",
    }));
  }, [data]);

  return (
    <Card className="grow">
      <CardHeader>
        <CardTitle>Balance History</CardTitle>
        <CardDescription>View your balance across different currencies</CardDescription>
      </CardHeader>
      <CardContent className="flex grow">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Icons.spinner className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={FundsList} />
        )}
      </CardContent>
    </Card>
  );
}

export default Page;
