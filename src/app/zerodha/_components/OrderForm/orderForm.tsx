import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useToast } from "../../_contexts/Toast/toast-context";
import BackndWSContext from "../../_contexts/backendWS/backendWS";
import { updateFormData } from "../../_redux/Slices/FormData";
import { AppDispatch, RootState } from "../../_redux/store";
import { TFormSchema } from "./FrmSchema";
import InputDiv from "./InputDiv";
import { CheckBox, OrderTypeDiv } from "./OrderTypeDiv";

export type TOrderType = "LIMIT" | "MARKET" | "STOP";
export const OrderTypeList: TOrderType[] = ["LIMIT", "MARKET", "STOP"];
export type TorderForm = {
  symbol: string;
  market: TmarketType;
  orderType: "BUY" | "SELL";
  quantity: number;
  price: number;
  sl: { isselected: boolean; price: number };
  tp: { isselected: boolean; price: number };
};
type TmarketType = "SPOT" | "MARGIN";
interface ITempOrderForm {
  symbol: string;
  type: "BUY" | "SELL";
}
function TempOrderForm({ symbol, type }: ITempOrderForm) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.output<TFormSchema>>({
    defaultValues: {
      sl: 0,
      tp: 0,
      price: 0,
      quantity: 1,
      symbolName: "symbol",
      orderType: "BUY",
      marketType: "SPOT",
    },
  });
  const dispatch = useDispatch<AppDispatch>();

  const FormData = useSelector((state: RootState) => state.FormData);

  useEffect(() => {
    setValue("symbolName", symbol);
  }, [symbol]);
  useEffect(() => {
    setValue("orderType", type);
  }, [type]);
  const [isAvl, setIsAvl] = useState<{
    sl: boolean;
    tp: boolean;
    orderType: TOrderType;
  }>({ sl: false, tp: false, orderType: "MARKET" });
  const toast = useToast();
  const queryClient = useQueryClient(); // Initialize queryClient
  const { WSsendOrder } = useContext(BackndWSContext);

  const orderapi = api.orders.create.useMutation({
    onSuccess: (msg) => {
      queryClient.refetchQueries().catch((err) => console.log(err));
      if (msg && toast) {
        console.log("mutation nsucess -> ", msg);
        toast.open({
          name: msg.name,
          state:
            msg.status === "open"
              ? "placed"
              : msg.status === "completed"
                ? "sucess"
                : "error",
          quantity: msg.quantity,
          orderId: msg.id,
          type: msg.type,
        });
        if (msg.status === "open") {
          WSsendOrder("order", msg);
        }
      }
    },
  });

  const onSubmit = (data: z.output<TFormSchema>) => {
    console.log("send order", data);
    orderapi.mutate({
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity),
      sl: Number(data.sl),
      tp: Number(data.tp),
      trigerType: isAvl.orderType,
    });

    dispatch(
      updateFormData({
        ...FormData,
        isvisible: false,
      }),
    );
  };
  const style = {
    bgcolor: watch().orderType === "BUY" ? "bg-[#4184f3]" : "bg-[#ff5722]",
    textcolor:
      watch().orderType === "BUY" ? "text-[#4184f3]" : "text-[#ff5722]",
    bordercolor:
      watch().orderType === "BUY" ? "border-b-[#4184f3]" : "border-b-[#ff5722]",
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={` absolute z-50 w-[600px] bg-white text-[.75rem] `}
      style={{ top: 0, right: 0 }}
    >
      <header
        className={`rounded-[3px_3px_0px_0px]  p-[15px_20px] text-white ${style.bgcolor}`}
      >
        <div className="text-[14px] font-semibold">
          {`${watch().orderType} ${watch().symbolName.toUpperCase()}  x ${
            watch().quantity
          } Qty`}
        </div>
        <div></div>
      </header>
      <div className={"flex w-full bg-[#f9f9f9]  "}>
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
                    : "text-[#9b9b9b]"
                } `
              }
            >
              {x}
            </div>
          );
        })}
        <div className=" grow p-[10px_20px] text-right text-[#4184f3]">
          Tags
        </div>
      </div>

      <div className="m-2 ">
        <div>
          <div className="flex ">
            <InputDiv
              Type="float"
              data={{
                label: "Qty.",
                isSelected: true,
              }}
              register={register}
              fileldName="quantity"
            />
            <InputDiv
              Type="float"
              data={{
                label: "Price",
                isSelected: isAvl.orderType !== "MARKET",
              }}
              register={register}
              fileldName="price"
            />
          </div>
          <div className="m-2 mr-3">
            <OrderTypeDiv Formdata={isAvl.orderType} setFormdata={setIsAvl} />
          </div>
        </div>
        <div className="flex ">
          <div className="flex flex-col items-end ">
            <InputDiv
              Type="float"
              data={{
                label: "SL",
                isSelected: isAvl.sl,
              }}
              register={register}
              fileldName="sl"
            />
            <div className="m-2">
              <CheckBox
                data={{
                  isSelected: isAvl.sl,
                  type: "SL",
                }}
                clickHandler={() => {
                  setIsAvl((prev) => {
                    return {
                      ...prev,
                      sl: !prev.sl,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-end ">
            <InputDiv
              Type="float"
              data={{
                label: "TP",
                isSelected: isAvl.tp,
              }}
              register={register}
              fileldName="tp"
            />
            <div className="m-2">
              <CheckBox
                data={{
                  isSelected: isAvl.tp,
                  type: "TP",
                }}
                clickHandler={() => {
                  setIsAvl((prev) => {
                    return {
                      ...prev,
                      tp: !prev.tp,
                    };
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full gap-2 bg-[rgb(249,249,249)] p-[15px_20px] text-[#444444] ">
        <div className="flex grow gap-1">
          <div className="flex gap-1">
            <p>Total </p> <div className={"" + style.textcolor}>${10}</div>
          </div>
          <div className="flex gap-1">
            <p>Charges </p>
            <div className={"" + style.textcolor}>${1}</div>
          </div>
        </div>
        <div className="flex gap-2 text-right">
          <input
            type="submit"
            className={
              "cursor-pointer p-[8px_12px] text-white " + style.bgcolor
            }
            value={watch().orderType}
          />
          <div
            className="cursor-pointer border border-[#444444] bg-white p-[8px_12px] text-[#444444] hover:bg-[#444444] hover:text-white"
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
      {JSON.stringify(watch())}
    </form>
  );
}

export default TempOrderForm;
