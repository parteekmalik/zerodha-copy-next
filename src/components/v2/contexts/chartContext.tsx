"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ChartContextType {
  symbolSelected: string;
  setSymbolSelected: (url: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export function ChartProvider({ children }: { children: ReactNode }) {
  const [symbolSelected, setSymbolSelected] = useState<string>("BTCUSDT");

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
