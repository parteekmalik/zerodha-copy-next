
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/v2/ui/form";
import { Input } from "~/components/v2/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/v2/ui/tabs";
import { Card, CardContent } from "~/components/v2/ui/card";

import { FormSchema } from "~/components/zerodha/OrderForm/FormSchema";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import useCreateOrderApi from "~/components/zerodha/_hooks/API/useCreateOrderApi";
import { Button } from "~/components/v2/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { type z } from "zod";
import { useChart } from "~/components/v2/contexts/chartContext";
import { useEffect } from "react";

export default function OrderForm({ className }: { className?: string }) {
    const { symbolSelected } = useChart();
    const { Livestream } = useBinanceLiveData();
    const { CreateOrderAPI } = useCreateOrderApi();
  
    const form = useForm<z.output<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        orderType: "BUY",
        trigerType: "MARKET",
        quantity: 0,
        price: 0,
        symbolName: symbolSelected,
        marketType: "SPOT",
      },
    });
    
    useEffect(() => form.setValue("symbolName", symbolSelected), [symbolSelected]);
    const currentPrice = Livestream[symbolSelected]?.curPrice;
    const orderType = form.watch("orderType");
    const triggerType = form.watch("trigerType");
  
    const onSubmit = (data: z.output<typeof FormSchema>) => {
      CreateOrderAPI.mutate({
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
      });
    };
  
    // TODO fix calulations 
    const handlePercentageClick = (percentage: number) => {
      const maxQuantity = 100;
      const newQuantity = (maxQuantity * percentage) / 100;
      form.setValue("quantity", Number(newQuantity));
    };
  
    return (
      <Card className={twMerge("grow-[2] border-border", className)}>
        <CardContent className="p-4">
          <Tabs defaultValue="BUY" onValueChange={(value) => form.setValue("orderType", value as "BUY" | "SELL")}>
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="BUY" className="data-[state=active]:bg-green-500/20">
                Buy
              </TabsTrigger>
              <TabsTrigger value="SELL" className="data-[state=active]:bg-red-500/20">
                Sell
              </TabsTrigger>
            </TabsList>
  
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            disabled={triggerType === "MARKET"}
                            value={triggerType === "MARKET" ? Number(currentPrice ?? 0) : field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant={triggerType === "LIMIT" ? "default" : "outline"}
                          onClick={() => {
                            form.setValue("trigerType", triggerType === "LIMIT" ? "MARKET" : "LIMIT");
                            form.setValue("price", Number(currentPrice ?? "0"));
                          }}
                        >
                          Limit
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            type="number" 
                            step="0.0001" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <div className="flex gap-2">
                            {[25, 50, 75, 100].map((percentage) => (
                              <Button
                                key={percentage}
                                type="button"
                                variant="outline"
                                className="flex-1 text-xs"
                                onClick={() => handlePercentageClick(percentage)}
                              >
                                {percentage}%
                              </Button>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total</span>
                  <span>{(form.watch("quantity") * (triggerType === "MARKET" ? Number(currentPrice ?? 0) : form.watch("price"))).toFixed(4)} USDT</span>
                </div>
  
                <Button type="submit" className="w-full text-white" variant={orderType === "BUY" ? "default" : "destructive"}>
                  {orderType === "BUY" ? "Buy" : "Sell"} {form.watch("symbolName")}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  