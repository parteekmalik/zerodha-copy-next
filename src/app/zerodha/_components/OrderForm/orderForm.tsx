import React, { Dispatch, SetStateAction } from "react";

export type TorderForm = {
  isvisible: boolean;
  symbol: string;
  market: TmarketType;
  type: "LIMIT" | "MARKET" | "STOP";
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

  return (
    <div className={` fixed w-[600px] text-[.75rem] `}>
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
        <div className="flex ">
          <InputDiv
            label="Qty."
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
            label="Price"
          />
        </div>
        <div className="flex ">
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
            label="SL"
          />
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
            label="TP"
          />
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
          <div className={"p-[8px_12px] text-white " + style.bgcolor}>
            {data.oderdetails.orderType}
          </div>
          <div className="border border-[#444444] bg-white p-[8px_12px] text-[#444444] hover:bg-[#444444] hover:text-white">
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
function InputDiv({
  label,
  changeHandler,
}: {
  label: string;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        onChange={changeHandler}
        className="m-2 rounded-[3px] border p-[10px_15px] focus:border-black focus:outline-none"
      />
      <div className=" absolute " style={{ top: "0px", left: "0px" }}>
        <div className="ml-5 bg-white ">{label}</div>
      </div>
    </div>
  );
}
export default OrderForm;
