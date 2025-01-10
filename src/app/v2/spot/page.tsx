"use client";
import React from "react";
import WatchList from "~/components/v2/WatchList/page";
import TradingViewWidget from "~/components/v2/chart";
import { useChart } from "~/components/v2/contexts/chartContext";
import { Card, CardContent } from "~/components/v2/ui/card";
import OrderForm from "~/components/v2/OrderForm";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import OrderBook from "~/components/v2/OrderHistory";

export default function Main() {
  const { isDeviceCompatible } = useDeviceType();
  const { symbolSelected } = useChart();
  return (
    <>
      {isDeviceCompatible("lg") && (
        <div className="hidden w-full grow lg:flex ">
          <WatchList />
          <div className="flex grow">
            <div className="m-2 ml-0 flex grow flex-col">
              <TradingViewWidget symbol={symbolSelected} timeFrame={"1D"} height="75%" />
              <Card className="mt-1 h-1/4 border-border overflow-y-auto">
                <CardContent className="p-3">
                  <OrderBook filterFor={symbolSelected}/>
                </CardContent>
              </Card>
            </div>
            <div className="m-2 ml-0 flex w-[450px] flex-col">
              <Card className="mb-2 grow-[3] border-border">
                <CardContent></CardContent>
              </Card>
              <OrderForm className="max-h-fit" />
            </div>
            <div className=""></div>
          </div>
        </div>
      )}
    </>
  );
}
