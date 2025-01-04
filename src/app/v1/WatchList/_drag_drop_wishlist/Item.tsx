import { Reorder, useDragControls } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getColor } from "~/app/v1/utils";
import { type ChangeState, type TsymbolLive } from "../../../../components/zerodha/_contexts/LiveData/BinanceWS";
import { BaseSymbolLayout, HiddenLayout } from "./HiddenLayout";

function Item({
  isup: diff,
  symbolLiveTemp,
  symbolName,
  submitUpdate,
}: {
  isup: ChangeState;
  symbolLiveTemp: TsymbolLive | undefined;
  symbolName: string;
  submitUpdate: () => void;
}) {
  const dragControls = useDragControls();
  const [isHover, setIsHover] = useState(false);
  return (
    <Reorder.Item
      id={symbolName}
      dragListener={false}
      dragControls={dragControls}
      value={symbolName}
      onDragEnd={() => {
        submitUpdate();
      }}
      className="relative touch-none bg-background"
    >
      <div
        className={twMerge(" relative flex border-y border-borderApp p-[12px_15px] hover:bg-lightGrayApp ", getColor(diff))}
        style={{ fontSize: ".8125rem" }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => setIsHover(true)}
      >
        <div
          className=" absolute h-full w-full text-foreground hover:cursor-move "
          style={{ transform: "translateX(-15px) translateY(-12px)" }}
          onPointerDown={(e) => dragControls.start(e)}
        ></div>
        <div className="flex w-full">
          <BaseSymbolLayout key={"watchlistItem_" + symbolName} symbolName={symbolName} symbolLiveTemp={symbolLiveTemp} />
          <div
            className={twMerge("  absolute  right-0 top-0 hidden  h-full gap-[2px] p-[8px_15px_8px_2px] text-foreground ", isHover && " flex ")}
            // style={{ transition: "all 0.15s ease" }}
          >
            <HiddenLayout symbolName={symbolName} />
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default Item;
