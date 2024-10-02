import { type $Enums } from "@prisma/client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useCancelOrders from "../_hooks/API/usecancelOrders";
import { updateFormData } from "../_redux/Slices/FormData";
import { type AppDispatch, type RootState } from "../_redux/store";

export type OrderOptionsListOptions = {
  Add?: boolean;
  Close?: boolean;
  Modify?: boolean;
  Cancel?: boolean;
};
export type OrderOptionReqOrderType = { name: string; type: $Enums.OrderType; id: number };
interface IOrderOptions {
  order: OrderOptionReqOrderType;
  options?: OrderOptionsListOptions;
  closeDrawer?: () => void;
}
const OrderOptionsList = ({ order, closeDrawer, options }: IOrderOptions) => {
  const { cancelOrdersAPI } = useCancelOrders();
  const FormData = useSelector((state: RootState) => state.FormData);
  const dispatch = useDispatch<AppDispatch>();

  const styles = "w-full py-2 px-4 lg:mx-5 text-center border border-y hover:cursor-pointer text-foreground bg-background border-borderApp";
  return (
    <div className="flex flex-col ">
      {options?.Add && (
        <div
          className={styles}
          onClick={() => {
            dispatch(updateFormData({ ...FormData, isvisible: true, type: order.type, symbol: order.name }));
            if (closeDrawer) closeDrawer();
          }}
        >
          Add
        </div>
      )}
      {options?.Close && (
        <div
          className={styles}
          onClick={() => {
            dispatch(updateFormData({ ...FormData, isvisible: true, type: order.type === "BUY" ? "SELL" : "BUY", symbol: order.name }));
            if (closeDrawer) closeDrawer();
          }}
        >
          Close
        </div>
      )}
      {options?.Cancel && (
        <div
          className={styles}
          onClick={() => {
            cancelOrdersAPI.mutate({ orderids: order.id });
            if (closeDrawer) closeDrawer();
          }}
        >
          Cancel
        </div>
      )}
      {options?.Modify && (
        <div
          className={styles}
          onClick={() => {
            if (closeDrawer) closeDrawer();
          }}
        >
          Modify
        </div>
      )}
      <Link onClick={closeDrawer} href={`Chart?symbol=${order.name.toUpperCase()}&TimeFrame=${"1D"}`} className={styles}>
        Chart
      </Link>
    </div>
  );
};

export default OrderOptionsList;
