"use client";
import { useEffect, useState } from "react";
import WatchList, { Tsymbol } from "./_components/WatchList/watchList";
import Header from "./_components/hearder";
import RightSide from "./_components/Rightside/RightSde";

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
    rightSideData: { type: "chart", symbol: "BTCUSDT", TimeFrame: "5" },
    watchList: [
      [
        { name: "gold", prevDayClose: 100, curPrice: 200000.01 },
        { name: "silver", prevDayClose: 20, curPrice: 10.01 },
      ],
    ],
  });

  useEffect(() => {
    console.log(data);
  }, [data]);


  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header data={data} setData={setData} />
      <div className="text-red flex w-full max-w-[1536px] grow  gap-1 p-5">
        <WatchList data={data.watchList} />
        <div className={" flex grow"}>
          <RightSide data={data.rightSideData} />
        </div>
      </div>
      <div>{JSON.stringify(data)}</div>
    </main>
  );
}
