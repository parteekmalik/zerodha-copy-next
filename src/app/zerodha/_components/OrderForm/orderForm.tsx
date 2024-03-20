import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DataContext from "../../_contexts/data/data";
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

function TempOrderForm({
  symbol,
  sendMessage,
  type,
}: {
  symbol: string;
  sendMessage: (payload: string) => void;
  type: "BUY" | "SELL";
}) {
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
  const { dataDispatch, dataState } = useContext(DataContext);

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

  const onSubmit = (data: z.output<TFormSchema>) => {
    console.log("send order", data);
    sendMessage(
      JSON.stringify({
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
        sl: Number(data.sl),
        tp: Number(data.tp),
        trigerType: isAvl.orderType, 
        // TradingAccountId: dataState.userDetails?.TradingAccountId,
      }),
    );
    dataDispatch({
      type: "update_FormData",
      payload: {
        ...dataState.FormData,
        isvisible: false,
      },
    });
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
      className={` absolute w-[600px] bg-white text-[.75rem] z-50 `}
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
              dataDispatch({
                type: "update_FormData",
                payload: {
                  ...dataState.FormData,
                  isvisible: false,
                },
              })
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
