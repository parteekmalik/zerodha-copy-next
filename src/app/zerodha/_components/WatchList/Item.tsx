import { Reorder, useDragControls } from "framer-motion";
import { TsymbolLive } from "../../_contexts/SymbolLive/SymbolLive";
import { BaseSymbolLayout, HiddenLayout } from "./helper";

function Item({
  diff,
  symbolLiveTemp,
  symbolName,
  listNo,
}: {
  diff: number;
  symbolLiveTemp: TsymbolLive | undefined;
  symbolName: string;
  listNo: number;
}) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      id={symbolName}
      dragListener={false}
      dragControls={dragControls}
      value={symbolName}
      className="relative translate-x-0"
    >
      <div
        className={
          "group/item relative flex border-b p-[12px_15px]   hover:bg-[#f9f9f9] " +
          getColor(diff)
        }
        style={{ fontSize: ".8125rem" }}
      >
        <div
          className=" absolute h-full w-full text-white hover:cursor-move"
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
              <HiddenLayout symbolName={symbolName} listNo={listNo} />
            </div>
          </>
        ) : (
          <div className="h-10 w-full border p-2">{symbolName}</div>
        )}
      </div>
    </Reorder.Item>
  );
}

const getColor = (diff: number) => {
  if (diff > 0) {
    return "text-[#4caf50]";
  } else if (diff < 0) {
    return "text-[#df514c]";
  } else {
    return "";
  }
};
export default Item;
