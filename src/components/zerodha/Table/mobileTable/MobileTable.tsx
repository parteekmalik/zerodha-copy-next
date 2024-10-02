import { type Order } from "@prisma/client";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useDrawer } from "../../_contexts/Drawer/DrawerContextComponent";
import OrderOptionsList, { type OrderOptionReqOrderType, type OrderOptionsListOptions } from "../OrderOptions";
export type MobileRowType = {
  raw: OrderOptionReqOrderType;
  onClick?: (order: Order) => void;
  content: { first: ReactNode[]; second: ReactNode[] }[];
}[];

const MobileTable = ({ orders, options }: { orders: MobileRowType; options?: OrderOptionsListOptions }) => {
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <div className=" flex flex-col gap-2 text-sm text-textDark  ">
      {orders.map((order, orderIndex) => {
        return (
          <div
            onClick={() =>
              openDrawer({
                content: <OrderOptionsList closeDrawer={closeDrawer} options={options} order={order.raw} />,
                type: "custom",
              })
            }
            className={twMerge("flex flex-col gap-1 border-b border-borderApp p-2  ", orderIndex === 0 ? "border-t" : "")}
            key={orderIndex}
          >
            {order.content.map((row, index) => (
              <div className={twMerge("flex justify-between gap-1", index === 1 && "text-foreground")} key={index}>
                <div className="flex gap-2">
                  {row.first.map((item, _) => (
                    <>{typeof item === "string" ? <div key={_}>{item}</div> : item}</>
                  ))}
                </div>
                <div className="flex gap-2">
                  {row.second.map((item, _) => (
                    <>{typeof item === "string" ? <div key={_}>{item}</div> : item}</>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MobileTable;
