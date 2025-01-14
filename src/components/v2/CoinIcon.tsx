import Image from "next/image";
import { type HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

function CoinIcon({ coinName, style, className, ...props }: { coinName: string } & HtmlHTMLAttributes<HTMLImageElement>) {
  const iconRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (iconRef.current) {
      setSize(iconRef.current.clientHeight);
    }
  }, []);

  useEffect(() => console.log("size changed", size), [size]);

  return (
    <Image
      {...props}
      ref={iconRef}
      className={twMerge("aspect-square min-h-full w-auto rounded-lg ", className)}
      src={`https://s3-symbol-logo.tradingview.com/crypto/XTVC${coinName}.svg`}
      alt={`${coinName} logo`}
      style={{ width: size, ...style }}
      width={50}
      height={50}
      onError={(e) => {
        e.currentTarget.src = "https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC.svg";
      }}
    />
  );
}

export default CoinIcon;
