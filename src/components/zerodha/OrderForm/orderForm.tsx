import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";
import { updateFormData } from "~/components/zerodha/_redux/Slices/FormData";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";
import { useBinanceLiveData } from "../_contexts/LiveData/useBinanceLiveData";
import { TFormSchema } from "./FormSchema";
import InputDiv from "./InputDiv";
import { OrderTypeDiv } from "./OrderTypeDiv";
import { twMerge } from "tailwind-merge";

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
  const { Livestream } = useBinanceLiveData();

  useEffect(() => {
    setValue("symbolName", FormData.symbol);
    setValue("orderType", FormData.type);
  }, [FormData]);

  const toast = useToast();
  const { WSsendOrder } = useContext(BackndWSContext);

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
            WSsendOrder("order", msg);
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
        data.price >= Number(Livestream[data.symbolName]?.curPrice ?? 0)
          ? "STOP"
          : data.price === 0
            ? "MARKET"
            : "LIMIT",
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={` absolute z-50 w-[600px] bg-background text-xs `}
      style={{ top: 0, right: 0 }}
    >
      <header
        className={`rounded-[3px_3px_0px_0px]  p-[15px_20px] text-white ${style.bgcolor}`}
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
        <div className=" grow p-[10px_20px] text-right text-blueApp">Tags</div>
      </div>

      <div className="m-2 ">
        <div>
          <div className="flex ">
            <InputDiv
              Type="float"
              data={{
                label: "Qty.",
                isDisabled: false,
              }}
              register={register("quantity")}
            />
            <InputDiv
              Type="float"
              data={{
                label: "Price",
                isDisabled: watch().isMarketOrder,
              }}
              register={register("price")}
            />
          </div>
          <div className="m-2 mr-3">
            <OrderTypeDiv
              isMarketOrder={watch().isMarketOrder}
              setFormdata={(isSelected: boolean) => {
                setValue("isMarketOrder", isSelected);
                if (!isSelected)
                  setValue(
                    "price",
                    Number(Livestream[watch().symbolName]?.curPrice) ?? 0,
                  );
                else setValue("price", 0);
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative flex w-full gap-2 bg-lightGrayApp p-[15px_20px] text-textDark ">
        <div className="flex grow gap-1">
          <div className="flex gap-1">
            <p>Total </p>{" "}
            <div className={"" + style.textcolor}>
              $
              {(
                Number(watch().quantity) *
                (watch().isMarketOrder
                  ? Number(Livestream[watch().symbolName]?.curPrice) ?? 0
                  : watch().price)
              ).toFixed(Number(Livestream[watch().symbolName]?.decimal) ?? 2)}
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
              "cursor-pointer p-[8px_12px]  font-medium text-white ",
              style.bgcolor,
            )}
            value={watch().orderType}
          />
          <div
            className="cursor-pointer border border-borderApp bg-background p-[8px_12px]  font-medium text-textDark hover:bg-borderApp hover:text-white"
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
      {/* {JSON.stringify(watch())} */}
    </form>
  );
}

export default TempOrderForm;
