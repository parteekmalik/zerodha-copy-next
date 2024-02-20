import { useContext, useEffect } from "react";
import DataContext from "../../_contexts/data/data";
import { OrderTypeList } from "./orderForm";

function OrderTypeDiv() {
  const Formdata = useContext(DataContext).dataState.FormData;
  const { dataDispatch } = useContext(DataContext);
  useEffect(() => {
    console.log(Formdata);
  }, [Formdata]);

  return (
    <div className="flex w-full items-center justify-center gap-2">
      {OrderTypeList.map((type) => {
        return (
          <CheckBox
            key={type + "123"}
            data={{ isSelected: Formdata.orderType === type, type }}
            clickHandler={() =>
              dataDispatch({
                type: "update_FormData",
                payload: { ...Formdata, orderType: type },
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
export default OrderTypeDiv;
