import { useContext, useEffect } from "react";
import BinanceWSContext from "./BinanceWS";

// Custom hook for safely using the WebSocket context values
export function useBinanceLiveData() {
  const context = useContext(BinanceWSContext);

  // Ensure the context is not undefined
  if (!context) {
    throw new Error(
      "useBinanceLiveData must be used within a BackndWSContextProvider",
    );
  }

  const { LiveStreanData, binanceServerConnection } = context;


  // Provide defaults to ensure values are never undefined
  return {
    Livestream: LiveStreanData ?? {},
    binanceServerConnection: binanceServerConnection ?? "disconneted",
  };
}
