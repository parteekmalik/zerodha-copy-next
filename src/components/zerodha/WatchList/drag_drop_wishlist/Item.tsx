import { Reorder, useDragControls } from "framer-motion";
import { BaseSymbolLayout, HiddenLayout } from "./HiddenLayout";
import { useState } from "react";
import { TsymbolLive } from "../../_redux/Slices/Livestream";

function Item({
  isup: diff,
  symbolLiveTemp,
  symbolName,
  submitUpdate,
}: {
  isup: number | boolean;
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
          " relative flex border-b p-[12px_15px]   hover:bg-[#f9f9f9] " +
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

export const getColor = (diff: number | string | boolean) => {
  if (typeof diff === "string") {
    if (diff === "completed") {
      diff = 1;
    } else if (diff === "cancelled") {
      diff = -1;
    } else if (diff.endsWith("%")) diff = diff.split("%")[0] ?? "";
  } else if (typeof diff === "boolean") diff = diff ? 1 : -1;
  diff = Number(diff);
  if (diff > 0) {
    return "text-[#4caf50]";
  } else if (diff < 0) {
    return "text-[#df514c]";
  } else {
    return "";
  }
};

export default Item;
