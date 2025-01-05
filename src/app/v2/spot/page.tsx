"use client";
import React, { useContext, useState } from "react";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import WatchList from "~/components/v2/WatchList/page";
import TradingViewWidget from "~/components/v2/chart";
import { useChart } from "~/components/v2/contexts/chartContext";
import { Card, CardContent } from "~/components/v2/ui/card";

function Main({ children }: { children: React.ReactNode }) {
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
              <Card className="mt-2 h-1/4 border-border">
                <CardContent></CardContent>
              </Card>
            </div>
            <Card className="w-[450px] m-2 ml-0 border-border">
              <CardContent></CardContent>
            </Card>
            <div className=""></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
