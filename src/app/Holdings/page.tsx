"use client";

import { useSelector } from "react-redux";
import { RootState } from "~/components/zerodha/_redux/store";

export default function DefaultComonent() {
  const Livestream = useSelector((state: RootState) => state.Livestream);
  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  const subsciptions = useSelector(
    (state: RootState) => state.BinanceWSStats.subsciptions,
  );
  const orders = 0;
  return <div className="">

  </div>;
}
