"use client";
import { FaCopy } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { Badge } from "~/components/v2/ui/badge";
import { Button } from "~/components/v2/ui/button";
import { Card, CardContent, CardHeader } from "~/components/v2/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/v2/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/v2/ui/tabs";
import { RootState } from "~/components/zerodha/_redux/store";
import { useCoin } from "../provider";

export default function Page() {
  const { coinName, tabOpened, setTabOpened, setCoinName } = useCoin();
  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  const randomString = Array.from({ length: 64 }, () => Math.random().toString(36)[2]).join("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(randomString).catch((error) => console.log(error));
    alert("Copied to clipboard!");
  };

  return (
    <Card className="flex w-1/4 flex-col">
      <CardHeader>
        <Select defaultValue="BTCUSDT" onValueChange={(value) => setCoinName(value)}>
          <SelectTrigger className="hide-last-of-first-child m-1 w-1/3 rounded-lg bg-primary/70 text-xl text-white shadow-md transition duration-200 ease-in-out hover:bg-primary/40">
            <SelectValue placeholder="Select a symbol" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            <SelectGroup className="text-lg">
              {Object.keys(symbolsList).map((symbol) => (
                <SelectItem key={symbol} value={symbol} className="hover:bg-primary/10">
                  <p>{symbol}</p>
                  <p>{symbolsList[symbol]?.name}</p>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex w-full grow">
        <Tabs
          value={tabOpened}
          defaultValue="deposit"
          className="flex h-full w-full flex-col"
          onValueChange={(value) => setTabOpened(value as "witdrawal" | "deposit" | "history")}
        >
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="witdrawal" className="font-semibold  data-[state=active]:bg-primary">
              Withdrawal
            </TabsTrigger>
            <TabsTrigger value="deposit" className="font-semibold  data-[state=active]:bg-primary">
              Deposit
            </TabsTrigger>
            <TabsTrigger value="history" className="font-semibold  data-[state=active]:bg-primary">
              History
            </TabsTrigger>
          </TabsList>
          <Card className="flex h-full flex-col">
            <CardContent className="flex grow   flex-col bg-primary/10 p-8">
              <TabsContent value="witdrawal">
                <div>Withdrawal Content</div>
              </TabsContent>
              <TabsContent value="deposit" className="flex flex-col items-center gap-2">
                <QRCode className="rounded-md bg-white p-2" value={`it is a link to deposit ${coinName} Coin.`} />
                <div className="flex w-3/4 gap-2">
                  <Badge variant="outline" className="max-w-full truncate bg-primary/20 text-lg text-white">
                    {randomString}
                  </Badge>
                  <Button onClick={copyToClipboard} className=" py-auto flex items-center rounded-lg bg-primary px-2  text-white hover:bg-primary/70">
                    <FaCopy className="mr-2" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div>History Content</div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </CardContent>
    </Card>
  );
}
