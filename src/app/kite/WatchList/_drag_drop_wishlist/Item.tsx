import { Reorder, useDragControls } from "framer-motion";
import { BaseSymbolLayout, HiddenLayout } from "./HiddenLayout";
import { useState } from "react";
import { getColor } from "~/app/kite/utils";
import {
  TsymbolLive,
  ChangeState,
} from "../../../../components/zerodha/_contexts/LiveData/BinanceWS";

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
      onDragEnd={(e) => {
        submitUpdate();
      }}
      className="relative"
    >
      <div
        className={
          " relative flex border-b border-borderApp p-[12px_15px]   hover:bg-lightGrayApp " +
          getColor(diff)
        }
        style={{ fontSize: ".8125rem" }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className=" absolute h-full w-full text-white hover:cursor-move "
          style={{ transform: "translateX(-15px) translateY(-12px)" }}
          onPointerDown={(e) => dragControls.start(e)}
        ></div>
        <div className="flex w-full">
          <BaseSymbolLayout
            key={"watchlistItem_" + symbolName}
            symbolName={symbolName}
            symbolLiveTemp={symbolLiveTemp}
          />
          <div
            className={
              "  absolute right-0 top-0 flex h-full gap-[2px] p-[8px_15px_8px_2px] text-white " +
              (isHover ? " visible opacity-100 " : " invisible opacity-0 ")
            }
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
