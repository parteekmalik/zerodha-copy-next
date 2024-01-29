// TradingViewWidget.jsx
import { memo, useEffect, useRef } from "react";

function TradingViewWidget({
  symbolName,
  charteheight,
}: {
  symbolName: string;
  charteheight: string;
  chartewidth: string;
}) {
  // fix any type
  const container = useRef<HTMLDivElement | null>(null);

  const loading = useRef(true);

  useEffect(() => {
    if (!loading.current) return;
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
          "interval": "5",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "save_image": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current?.appendChild(script);
    loading.current = false;
  }, []);
  return (
    <div
      className="tradingview-widget-container h-[100vh] min-h-[100%]  min-w-[100%]"
      ref={container}
    />
  );
}

export default memo(TradingViewWidget);
