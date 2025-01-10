// TradingViewWidget.jsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  timeFrame?: string;
  height?: string;
}

function TradingViewWidget({ symbol = "BTCUSDT", timeFrame = "5", height = "100%" }: TradingViewWidgetProps) {
  const { resolvedTheme } = useTheme();
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "height": "${height}",
          "width": "100%",
          "symbol": "${symbol}",
          "interval": "${timeFrame}",
          "timezone": "Etc/UTC",
          "theme": "${resolvedTheme}",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "save_image": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current?.appendChild(script);
  }, [height, symbol, resolvedTheme, timeFrame]);

  return <div className={`tradingview-widget-container`} ref={container}></div>;
}

export default TradingViewWidget;
