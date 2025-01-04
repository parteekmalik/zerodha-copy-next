import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { type z } from "zod";
import { calStep } from "~/app/v1/utils";
import { useDragContext } from "~/components/zerodha/_contexts/React-DnD/DragContext";
import { updateFormData } from "~/components/zerodha/_redux/Slices/FormData";
import { type AppDispatch, type RootState } from "~/components/zerodha/_redux/store";
import { websocketService } from "../_contexts/LiveData/BinanceWSContextComponent";
import useCreateOrderApi from "../_hooks/API/useCreateOrderApi";
import { type TFormSchema } from "./FormSchema";
import InputDiv from "./InputDiv";
import { OrderTypeDiv } from "./OrderTypeDiv";
import { useDrawer } from "../_contexts/Drawer/DrawerContextComponent";

export type TOrderType = "LIMIT" | "MARKET" | "STOP";
// export const OrderTypeList: TOrderType[] = ["LIMIT", "MARKET", "STOP"];
export type TorderForm = {
  symbol: string;
  market: TmarketType;
  orderType: "BUY" | "SELL";
  quantity: number;
  price: number;
};
type TmarketType = "SPOT" | "MARGIN";

function TempOrderForm() {
  // prettier-ignore
  const {
    register,
    handleSubmit,
    setValue, 
    watch,reset,
  } = useForm<{isMarketOrder: boolean; } & z.output<TFormSchema>>({
    defaultValues: {
      price: 0,
      quantity: 1,
      symbolName: "symbol",
      orderType: "BUY",
      marketType: "SPOT",
      isMarketOrder: true,
    },
  });

  // prettier-ignore
  const style = watch().orderType === "BUY" ? { bgcolor: "bg-blueApp", textcolor: "text-blueApp", bordercolor: "border-b-blueApp" } : { bgcolor: "bg-orangeApp", textcolor: "text-orangeApp", bordercolor: "border-b-orangeApp" };

  const dispatch = useDispatch<AppDispatch>();

  const FormData = useSelector((state: RootState) => state.FormData);

  useEffect(() => {
    setValue("symbolName", FormData.symbol);
    setValue("orderType", FormData.type);
  }, [FormData, setValue]);

  const { CreateOrderAPI } = useCreateOrderApi();

  const onSubmit = (data: z.output<TFormSchema>) => {
    console.log("send order", data);
    CreateOrderAPI.mutate({
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity),
      trigerType:
        data.price === 0
          ? "MARKET"
          : (websocketService.reducer({
              action: "comparePrice",
              payload: { name: data.symbolName, price: data.price },
            }) ?? "MARKET"),
    });

    closeDrawer();
    reset();
    dispatch(
      updateFormData({
        ...FormData,
        editOrder: undefined,
        isvisible: false,
      }),
    );
  };
  const useDragContextDAta = useDragContext();
  const { closeDrawer } = useDrawer();
  if (!FormData.isvisible) return null;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={twMerge("  w-full bg-background text-xs lg:max-w-[600px] ")}>
      <header
        id="drag-handle"
        onMouseDown={useDragContextDAta?.handleMouseDown} // Allow dragging on the entire box
        className={` cursor-default rounded-[3px_3px_0px_0px]  p-[15px_20px] text-white lg:hover:cursor-move ${style.bgcolor}`}
      >
        <div className="text-sm font-semibold">
          {`${FormData.editOrder ? "EDIT " : ""}${watch().orderType} ${watch().symbolName.toUpperCase()}  x ${watch().quantity} Qty`}
        </div>
        <div></div>
      </header>

      <div className={"flex w-full bg-lightGrayApp  "}>
        {(["SPOT", "MARGIN"] as TmarketType[]).map((x) => {
          return (
            <div
              key={"form" + x}
              onClick={() => {
                setValue("marketType", x);
              }}
              className={
                "cursor-pointer border-b-2  p-[10px_20px]  " +
                ` ${x === watch().marketType ? `${style.textcolor} ${style.bordercolor}` : "text-darkGrayApp"} `
              }
            >
              {x}
            </div>
          );
        })}
        <div className=" grow p-[10px_20px] text-right text-blueApp">Tags</div>
      </div>

      <div className="m-2 p-5">
        <div className="flex flex-col gap-5">
          <div className="grid w-full grid-cols-1 gap-5 lg:w-fit lg:grid-cols-2 ">
            <InputDiv
              className="flex w-full justify-center"
              Type="float"
              data={{
                label: "Qty.",
                isDisabled: false,
              }}
              step={0.00001}
              register={register("quantity")}
            />
            <InputDiv
              className="flex w-full justify-center"
              Type="float"
              step={calStep(FormData.decimal)}
              data={{
                label: "Price",
                isDisabled: watch().isMarketOrder,
              }}
              register={register("price")}
            />
            <OrderTypeDiv
              className=" lg:col-start-2  "
              isMarketOrder={watch().isMarketOrder}
              setFormdata={(isSelected: boolean) => {
                setValue("isMarketOrder", isSelected);
                if (!isSelected) setValue("price", FormData.curPrice);
                else setValue("price", 0);
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative flex w-full  flex-col gap-2 bg-lightGrayApp p-[15px_20px] text-textDark lg:flex-row ">
        <div className="flex grow gap-1">
          <div className="flex gap-1">
            <p>Total </p>{" "}
            <div className={"" + style.textcolor}>
              ${(Number(watch().quantity) * (watch().isMarketOrder ? FormData.curPrice : watch().price)).toFixed(FormData.decimal)}
            </div>
          </div>
          <div className="flex gap-1">
            <p>Charges </p>
            <div className={"flex gap-2"}>
              <span className={style.textcolor}>${0}</span>
              <p className=" text-white">(*for limited time)</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-right">
          {/* make input stop updation on every render */}
          <input
            type="submit"
            className={twMerge("grow cursor-pointer p-[8px_12px] font-medium  text-white lg:grow-0 ", style.bgcolor)}
            value={watch().orderType}
          />
          <div
            className="grow cursor-pointer border border-borderApp bg-background p-[8px_12px] text-center font-medium  text-textDark hover:bg-borderApp hover:text-white lg:grow-0"
            onClick={() => {
              closeDrawer();
              reset();
              dispatch(
                updateFormData({
                  ...FormData,
                  editOrder: undefined,
                  isvisible: false,
                }),
              );
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </form>
  );
}

export default TempOrderForm;
