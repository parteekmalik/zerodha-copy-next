import { useEffect } from "react";
import Draggable from "react-draggable";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";
import { updateFormData } from "~/components/zerodha/_redux/Slices/FormData";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { websocketService } from "../_contexts/LiveData/BinanceWSContextComponent";
import { useBackendWS } from "../_contexts/backendWS/backendWSContextComponent";
import { TFormSchema } from "./FormSchema";
import InputDiv from "./InputDiv";
import { OrderTypeDiv } from "./OrderTypeDiv";
import { UPDATE_OR_ADD_ORDER } from "WStypes/typeForSocketToFrontend";

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

function TempOrderForm({ isdraggable = true }: { isdraggable?: boolean }) {
  // prettier-ignore
  const {
    register,
    handleSubmit,
    setValue, 
    watch,
    formState: { errors },
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
  const APIutils = api.useUtils();

  const FormData = useSelector((state: RootState) => state.FormData);

  useEffect(() => {
    setValue("symbolName", FormData.symbol);
    setValue("orderType", FormData.type);
  }, [FormData]);

  const toast = useToast();
  const { WSsendOrder } = useBackendWS();

  const orderapi = api.Order.createOrder.useMutation({
    onSuccess: (messages) => {
      messages.map((msg) => {
        if (msg && toast) {
          console.log("mutation nsucess -> ", msg);
          if (typeof msg === "string") {
            toast.open({
              state: "error",
              errorMessage: msg,
            });
          } else {
            toast.open({
              name: msg.name,
              state:
                msg.status === "OPEN"
                  ? "placed"
                  : msg.status === "COMPLETED" || msg.status === "CANCELLED"
                    ? "sucess"
                    : "error",
              quantity: msg.quantity,
              orderId: msg.id,
              type: msg.type,
            });
            WSsendOrder({ type: UPDATE_OR_ADD_ORDER, payload: msg });
          }
        }
      });
    },
    onSettled() {
      APIutils.Order.getOrders.refetch().catch((err) => console.log(err));
      APIutils.Console.getRemainingFilledOrders
        .refetch()
        .catch((err) => console.log(err));
      APIutils.getAccountInfo.getAllBalance
        .refetch()
        .catch((err) => console.log(err));
    },
  });

  const onSubmit = (data: z.output<TFormSchema>) => {
    console.log("send order", data);
    orderapi.mutate({
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity),
      trigerType:
        websocketService.reducer({
          action: "comparePrice",
          payload: { name: data.symbolName, price: data.price },
        }) ?? "MARKET",
    });

    dispatch(
      updateFormData({
        ...FormData,
        isvisible: false,
      }),
    );
  };
  if (!FormData.isvisible) return null;
  return (
    <Draggable handle=".drag-handle" disabled={!isdraggable} bounds="parent">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={twMerge(
          "  w-full max-w-[600px] bg-background text-xs ",
          "lg:absolute lg:bottom-0 lg:left-1/3 lg:z-50 ",
        )}
      >
        <header
          className={`drag-handle cursor-default rounded-[3px_3px_0px_0px]  p-[15px_20px] text-white lg:hover:cursor-move ${style.bgcolor}`}
        >
          <div className="text-sm font-semibold">
            {`${watch().orderType} ${watch().symbolName.toUpperCase()}  x ${
              watch().quantity
            } Qty`}
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
                  ` ${
                    x === watch().marketType
                      ? `${style.textcolor} ${style.bordercolor}`
                      : "text-darkGrayApp"
                  } `
                }
              >
                {x}
              </div>
            );
          })}
          <div className=" grow p-[10px_20px] text-right text-blueApp">
            Tags
          </div>
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
                step={Number(`0.${"0".repeat(FormData.decimal - 1)}1`)}
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
                $
                {(
                  Number(watch().quantity) *
                  (watch().isMarketOrder ? FormData.curPrice : watch().price)
                ).toFixed(FormData.decimal)}
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
              className={twMerge(
                "grow cursor-pointer p-[8px_12px] font-medium  text-white lg:grow-0 ",
                style.bgcolor,
              )}
              value={watch().orderType}
            />
            <div
              className="grow cursor-pointer border border-borderApp bg-background p-[8px_12px] text-center font-medium  text-textDark hover:bg-borderApp hover:text-white lg:grow-0"
              onClick={() =>
                dispatch(
                  updateFormData({
                    ...FormData,
                    isvisible: false,
                  }),
                )
              }
            >
              Cancel
            </div>
          </div>
        </div>
      </form>
    </Draggable>
  );
}

export default TempOrderForm;
