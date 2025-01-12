import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/v2/ui/card";
import { api } from "~/trpc/server";

async function page() {
  const data = await api.Console.getPositionCurrentDetails.query();

  return (
    <div>
      <div className="mb-1 grid gap-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Your total available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{`$${(Number(data?.currentTotal) + Number(data?.usdtBalance)).toFixed(2)}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Your total available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{`$${(Number(data?.currentTotal) + Number(data?.usdtBalance)).toFixed(2)}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Your total available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{`$${(Number(data?.currentTotal) + Number(data?.usdtBalance)).toFixed(2)}`}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
