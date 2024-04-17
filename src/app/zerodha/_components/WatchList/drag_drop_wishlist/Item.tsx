import { Reorder, useDragControls } from "framer-motion";
import { BaseSymbolLayout, HiddenLayout } from "./HiddenLayout";
import { TsymbolLive } from "~/app/zerodha/_redux/storeComponent";
import { useSelector } from "react-redux";
import { RootState } from "~/app/zerodha/_redux/store";

function Item({
  diff,
  symbolLiveTemp,
  symbolName,
  submitUpdate,
}: {
  diff: number;
  symbolLiveTemp: TsymbolLive | undefined;
  symbolName: string;
  submitUpdate: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      id={symbolName}
      dragListener={false}
      dragControls={dragControls}
      value={symbolName}
      onDragEnd={(e) => {
        submitUpdate();
      }}
      className="relative translate-x-0"
      translate="no"
    >
      <div
        className={
          "group/item relative flex border-b p-[12px_15px]   hover:bg-[#f9f9f9] " +
          getColor(diff)
        }
        style={{ fontSize: ".8125rem" }}
      >
        <div
          className=" absolute h-full w-full text-white hover:cursor-move "
          style={{ transform: "translateX(-15px) translateY(-12px)" }}
          onPointerDown={(e) => dragControls.start(e)}
        ></div>
        {symbolLiveTemp ? (
          <>
            <BaseSymbolLayout
              key={"watchlistItem_" + symbolName}
              symbolName={symbolName}
              symbolLiveTemp={symbolLiveTemp}
            />
            <div className=" invisible absolute right-0 top-0 flex h-full gap-2 p-[8px_15px_8px_2px] text-white group-hover/item:visible">
              <HiddenLayout symbolName={symbolName} />
            </div>
          </>
        ) : (
          <div className="h-10 w-full border p-2">{symbolName}</div>
        )}
      </div>
    </Reorder.Item>
  );
}

export const getColor = (diff: number | string) => {
  if (typeof diff === "string" && diff.endsWith("%"))
    diff = diff.split("%")[0] ?? "";
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
