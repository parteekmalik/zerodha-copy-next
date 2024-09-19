import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
export type MobileRowType = { first: ReactNode[]; second: ReactNode[] }[][];

const MobileTable = ({ orders }: { orders: MobileRowType }) => {
  return (
    <div className=" flex flex-col gap-2 text-sm text-textDark  lg:hidden">
      {orders.map((order, orderIndex) => {
        return (
          <div
            className={twMerge(
              "flex flex-col gap-1 border-b border-borderApp p-2  ",
              orderIndex === 0 ? "border-t" : "",
            )}
            key={orderIndex}
          >
            {order.map((row, index) => (
              <div
                className={twMerge(
                  "flex justify-between gap-1",
                  index === 1 && "text-foreground",
                )}
                key={index}
              >
                <div className="flex gap-2">
                  {row.first.map((item, _) => (
                    <>
                      {typeof item === "string" ? (
                        <div key={_}>{item}</div>
                      ) : (
                        item
                      )}
                    </>
                  ))}
                </div>
                <div className="flex gap-2">
                  {row.second.map((item, _) => (
                    <>
                      {typeof item === "string" ? (
                        <div key={_}>{item}</div>
                      ) : (
                        item
                      )}
                    </>
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
