// TradingViewWidget.jsx
"use client";

import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

function TradingViewWidget() {
  // fix any type
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  // useEffect(() => console.log(searchParams.get("symbol")), [searchParams]);
  const [symbolName, TimeFrame] = useMemo(
    () => [
      searchParams.get("symbol") ?? "BTCUSDT",
      searchParams.get("TimeFrame") ?? "5",
    ],
    [searchParams],
  );
  const charteheight = "";
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      while (container.current.firstChild) {
        // Remove the first child element
        container.current.removeChild(container.current.firstChild);
      }
    }
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "height": "100%",
          "width": "100%",
          "symbol": "${symbolName}",
          "interval": "${TimeFrame}",
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
    // console.log("Chart modified", container.current);
  }, [charteheight, symbolName, resolvedTheme, TimeFrame]);
  return (
    <div
      className="tradingview-widget-container h-[100vh] min-h-[100%]  min-w-[100%]"
      ref={container}
    ></div>
  );
}

export default TradingViewWidget;
