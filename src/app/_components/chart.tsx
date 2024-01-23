// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget({
  symbolName,
  charteheight,
  chartewidth,
}: {
  symbolName: string;
  charteheight: string;
  chartewidth: string;
}) {
  // fix any type
  const container: any = useRef();
  let loading = useRef(true).current;
  useEffect(() => {
    if (!loading) return;
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "height": "${charteheight}",
          "width": "${charteheight}",
          "symbol": "${symbolName}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "save_image": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.appendChild(script);
    loading = false;
  }, []);
  return (
    <div
      className="tradingview-widget-container h-[100vh] min-h-[100%]  min-w-[100%]"
      ref={container}
    />
  );
}

export default memo(TradingViewWidget);
