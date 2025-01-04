"use client";
import React from "react";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import WatchList from "~/app/v1/WatchList/page";

function Main({ children }: { children: React.ReactNode }) {
  const { isDeviceCompatible } = useDeviceType();

  return (
    <>
      {isDeviceCompatible("lg") ? null : <div className="flex h-full w-full  overflow-y-auto lg:hidden ">{children}</div>}

      {isDeviceCompatible("lg") && (
        <div className="hidden w-full grow overflow-hidden lg:flex ">
          <WatchList />
          <div className="flex grow ">
            <div className="w-full  border-r border-r-borderApp bg-background" style={{ scrollbarWidth: "none" }}>
              <div className="h-full w-full overflow-y-auto overflow-x-hidden">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
