"use client";
import { useEffect, useState } from "react";
import RightSide from "./_components/Rightside/RightSde";
import WatchList from "./_components/WatchList/watchList";
import type { Tsymbol } from "./_components/WatchList/watchList";
import Header from "./_components/hearder";
import SymbolLiveContextComponent from "./_contexts/SymbolLive/SymbolLiveContextComponent";

export type TrightSideType =
  | { type: "Dashboard" }
  | { type: "Orders" }
  | { type: "Holdings" }
  | { type: "Positions" }
  | { type: "Bids" }
  | { type: "Funds" }
  | {
      type: "chart";
      symbol: string;
      TimeFrame: string;
    };
export type Tdata = {
  rightSideData: TrightSideType;
  watchList: Tsymbol[][];
};
export default function Home() {
  const [data, setData] = useState<Tdata>({
    // rightSideData: { type: "chart", symbol: "BTCUSDT", TimeFrame: "5" },
    rightSideData: { type: "Dashboard" },
    watchList: [
      [
        { name: "rvnusdt", prevDayClose: 100, curPrice: 200000.01 },
        { name: "barusdt", prevDayClose: 20, curPrice: 10.01 },
      ],
    ],
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <SymbolLiveContextComponent>
      <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
        <Header data={data} setData={setData} />
        <div className="text-red flex w-full max-w-[1536px] grow  ">
          <WatchList data={data.watchList} />
          <div className={" flex grow max-w-[1110px]"}>
            <RightSide data={data.rightSideData} />
          </div>
        </div>
        <div>{JSON.stringify(data)}</div>
      </main>
    </SymbolLiveContextComponent>
  );
}
