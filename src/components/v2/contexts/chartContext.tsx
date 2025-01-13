"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { updateSeprateSubscriptions } from "~/components/zerodha/_redux/Slices/BinanceWSStats";
import { type AppDispatch } from "~/components/zerodha/_redux/store";

interface ChartContextType {
  symbolSelected: string;
  setSymbolSelected: (url: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export function ChartProvider({ children }: { children: ReactNode }) {
  const [symbolSelected, setSymbolSelected] = useState<string>("BTCUSDT");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(updateSeprateSubscriptions({ name: "spot", subsription: [symbolSelected] }));
  }, [setSymbolSelected, dispatch, symbolSelected]);

  const value = {
    symbolSelected,
    setSymbolSelected,
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
