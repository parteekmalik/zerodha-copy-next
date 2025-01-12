"use client";
import { useChart } from "~/components/v2/contexts/chartContext";
import OrderForm from "~/components/v2/spot/OrderForm";
import OrderBook from "~/components/v2/spot/OrderDetails";
import SymbolDetails from "~/components/v2/spot/SymbolDetails";
import WatchList from "~/components/v2/spot/WatchList/page";
import TradingViewWidget from "~/components/v2/spot/chart";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";

export default function Main() {
  const { isDeviceCompatible } = useDeviceType();
  const { symbolSelected } = useChart();
  return (
    <>
      {isDeviceCompatible("lg") && (
        <div className="hidden w-full grow lg:flex ">
          <WatchList />
          <div className="flex grow">
            <div className="flex grow flex-col">
              <TradingViewWidget symbol={symbolSelected} timeFrame={"1D"} height="75%" />
              <OrderBook filterFor={symbolSelected} />
            </div>
            <div className="ml-1 flex w-[450px] flex-col">
              <SymbolDetails />
              <OrderForm className="max-h-fit" />
            </div>
            <div className=""></div>
          </div>
        </div>
      )}
    </>
  );
}
