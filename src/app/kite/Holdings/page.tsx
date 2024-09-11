"use client";

import { useSelector } from "react-redux";
import { useBinanceLiveData } from "~/components/zerodha/_contexts/LiveData/useBinanceLiveData";
import { RootState } from "~/components/zerodha/_redux/store";

export default function DefaultComonent() {
  const { Livestream } = useBinanceLiveData();
  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  const subsciptions = useSelector(
    (state: RootState) => state.BinanceWSStats.subsciptions,
  );

  return (
    <div className="">
      <div>
        {Object.keys(Livestream).map((key) => {
          const item = Livestream[key];
          return (
            <div className="" key={key}>
              {JSON.stringify(item)}
            </div>
          );
        })}
      </div>
      {/* <div>{symbolLiveState.Livestream}</div> */}
      <div>{JSON.stringify(Object.keys(symbolsList))}</div>
      <div>{JSON.stringify(Object.keys(subsciptions))}</div>
    </div>
  );
}
