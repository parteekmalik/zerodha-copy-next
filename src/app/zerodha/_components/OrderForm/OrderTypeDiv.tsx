import { useEffect } from "react";
import { OrderTypeList, TOrderType } from "./orderForm";

function OrderTypeDiv({
  selected,
  setSelected,
}: {
  selected: TOrderType;
  setSelected: React.Dispatch<React.SetStateAction<TOrderType>>;
}) {
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <div className="flex w-full items-center justify-center gap-2">
      {OrderTypeList.map((type) => {
        return (
          <CheckBox
            key={type + "123"}
            data={{ isSelected: selected === type, type }}
            clickHandler={(e) => {
              setSelected(type);
            }}
          />
        );
      })}
    </div>
  );
}
export function CheckBox({
  data: { isSelected, type },
  clickHandler,
}: {
  data: { isSelected: boolean; type: string };
  clickHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-center justify-center gap-1"
      onClick={clickHandler}
    >
      {!isSelected ? (
        <div className="h-[10px] w-[10px]  rounded-full border border-black opacity-[.75]"></div>
      ) : (
        <div className="flex h-[10px] w-[10px] items-center justify-center rounded-full border border-black ">
          <div className="h-[6px] w-[6px] rounded-full bg-blue-500 "></div>
        </div>
      )}
      <div>{type}</div>
    </div>
  );
}
export default OrderTypeDiv;
