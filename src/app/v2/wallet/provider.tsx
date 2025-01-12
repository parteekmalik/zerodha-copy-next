"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CoinContextType {
  coinName: string;
  setCoinName: (name: string) => void;
  tabOpened: "witdrawal" | "deposit" | "history";
  setTabOpened: (tab: "witdrawal" | "deposit" | "history") => void;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coinName, setCoinName] = useState<string>("BTC");
  const [tabOpened, setTabOpened] = useState<"witdrawal" | "deposit" | "history">("deposit");

  return (
    <CoinContext.Provider value={{ coinName, setCoinName, tabOpened, setTabOpened }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoin = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoin must be used within a CoinProvider");
  }
  return context;
};

export default function ContextLayer({ children }: { children: React.ReactNode }) {
  return (
    <CoinProvider>
      {children}
    </CoinProvider>
  );
}