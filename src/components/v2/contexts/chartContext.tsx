"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { updateSeprateSubscriptions } from "~/components/zerodha/_redux/Slices/BinanceWSStats";
import { type AppDispatch } from "~/components/zerodha/_redux/store";

interface ChartContextType {
  symbolSelected: string;
  setSymbolSelected: (url: string) => void;
  timeSelected: typeof timeOptions[number];
  setTimeSelected: (time: typeof timeOptions[number]) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);
export const timeOptions = ["1", "5", "15", "30", "1h", "4h", "1D", "1W", "1M"] as const;
export function ChartProvider({ children }: { children: ReactNode }) {
  const [symbolSelected, setSymbolSelected] = useState<string>("BTCUSDT");
  const [timeSelected, setTimeSelected] = useState<typeof timeOptions[number]>("5");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(updateSeprateSubscriptions({ name: "spotCoinSelected", subsription: [symbolSelected] }));
  }, [setSymbolSelected, dispatch, symbolSelected]);

  const value = {
    symbolSelected,
    setSymbolSelected,
    timeSelected,
    setTimeSelected,
  };

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

export function useChart() {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
}
