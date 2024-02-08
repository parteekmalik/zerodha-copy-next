import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import InputDiv from "./InputDiv";
import OrderTypeDiv, { CheckBox } from "./OrderTypeDiv";
export type TOrderType = "LIMIT" | "MARKET" | "STOP";
export const OrderTypeList: TOrderType[] = ["LIMIT", "MARKET", "STOP"];
export type TorderForm = {
  isvisible: boolean;
  symbol: string;
  market: TmarketType;
  type: TOrderType;
  oderdetails: {
    orderType: "BUY" | "SELL";
    quantity: number;
    price: number;
    sl: number;
    tp: number;
  };
};
type TmarketType = "SPOT" | "MARGIN";
export interface IOrderForm {
  data: TorderForm;
  setData: Dispatch<SetStateAction<TorderForm>>;
}
function OrderForm({ data, setData }: IOrderForm) {
  const style = {
    bgcolor:
      data.oderdetails.orderType === "BUY" ? "bg-[#4184f3]" : "bg-[#ff5722]",
    textcolor:
      data.oderdetails.orderType === "BUY"
        ? "text-[#4184f3]"
        : "text-[#ff5722]",
    bordercolor:
      data.oderdetails.orderType === "BUY"
        ? "border-b-[#4184f3]"
        : "border-b-[#ff5722]",
  };
  const [selected, setSelected] = useState<TOrderType>("MARKET");
  const [IsSLTP, setIsSLTP] = useState<{ sl: boolean; tp: boolean }>({
    sl: false,
    tp: false,
  });
  const disableimage =
    "data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0h1L0 6V5zm1 5v1H5z' fill='%23ddd' fill-rule='evenodd'/%3E%3C/svg%3E";
  function handleSubmit(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    console.log("send order");
  }
  return (
    <div className={` fixed w-[600px] bg-white text-[.75rem] `}>
      <header
        className={`rounded-[3px_3px_0px_0px]  p-[15px_20px] text-white ${style.bgcolor}`}
      >
        <div className="text-[14px] font-semibold">
          {`${data.oderdetails.orderType} ${data.symbol.toUpperCase()}  x ${
            data.oderdetails.quantity
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
                setData((prev) => {
                  return { ...prev, market: x };
                });
              }}
              className={
                "cursor-pointer border-b-2  p-[10px_20px]  " +
                ` ${
                  x === data.market
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
              data={{
                label: "Qty.",
                number: data.oderdetails.quantity,
                isSelected: true,
              }}
              changeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
                setData((prev) => {
                  return {
                    ...prev,
                    oderdetails: {
                      ...prev.oderdetails,
                      quantity: Number(e.target.value),
                    },
                  };
                });
              }}
            />
            <InputDiv
              changeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
                setData((prev) => {
                  return {
                    ...prev,
                    oderdetails: {
                      ...prev.oderdetails,
                      price: Number(e.target.value),
                    },
                  };
                });
              }}
              data={{
                label: "Price",
                number: selected !== "MARKET" ? data.oderdetails.price : 0,
                isSelected: selected !== "MARKET",
              }}
            />
          </div>
          <div className="m-2 mr-3">
            <OrderTypeDiv selected={selected} setSelected={setSelected} />
          </div>
        </div>

        <div className="flex ">
          <div className="flex flex-col items-end ">
            <InputDiv
              changeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
                setData((prev) => {
                  return {
                    ...prev,
                    oderdetails: {
                      ...prev.oderdetails,
                      sl: Number(e.target.value),
                    },
                  };
                });
              }}
              data={{
                label: "SL",
                number: IsSLTP.sl ? data.oderdetails.sl : 0,
                isSelected: IsSLTP.sl,
              }}
            />
            <div className="m-2">
              <CheckBox
                data={{ isSelected: IsSLTP.sl, type: "SL" }}
                clickHandler={(e) => {
                  setIsSLTP((prev) => {
                    return { ...prev, sl: !prev.sl };
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-end ">
            <InputDiv
              changeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
                setData((prev) => {
                  return {
                    ...prev,
                    oderdetails: {
                      ...prev.oderdetails,
                      tp: Number(e.target.value),
                    },
                  };
                });
              }}
              data={{
                label: "TP",
                number: IsSLTP.tp ? data.oderdetails.tp : 0,
                isSelected: IsSLTP.tp,
              }}
            />
            <div className="m-2">
              <CheckBox
                data={{ isSelected: IsSLTP.tp, type: "TP" }}
                clickHandler={(e) => {
                  setIsSLTP((prev) => {
                    return { ...prev, tp: !prev.tp };
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
          <div
            className={
              "cursor-pointer p-[8px_12px] text-white " + style.bgcolor
            }
            onClick={handleSubmit}
          >
            {data.oderdetails.orderType}
          </div>
          <div
            className="cursor-pointer border border-[#444444] bg-white p-[8px_12px] text-[#444444] hover:bg-[#444444] hover:text-white"
            onClick={(e) =>
              setData((prev) => {
                return { ...prev, isvisible: false };
              })
            }
          >
            Cancel
          </div>
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
}

export default OrderForm;
