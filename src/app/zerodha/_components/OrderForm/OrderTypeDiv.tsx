import { Dispatch, SetStateAction, useEffect } from "react";
import { TOrderType, OrderTypeList } from "./orderForm";

export function OrderTypeDiv({
  Formdata,
  setFormdata,
}: {
  Formdata: TOrderType;
  setFormdata: Dispatch<
    SetStateAction<{
      sl: boolean;
      tp: boolean;
      orderType: TOrderType;
    }>
  >;
}) {
  useEffect(() => {
    console.log(Formdata);
  }, [Formdata]);

  return (
    <div className="flex w-full items-center justify-center gap-2">
      {OrderTypeList.map((type) => {
        return (
          <CheckBox
            key={type + "123"}
            data={{ isSelected: Formdata === type, type }}
            clickHandler={() =>
              setFormdata((prev) => {
                return { ...prev, orderType: type };
              })
            }
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
