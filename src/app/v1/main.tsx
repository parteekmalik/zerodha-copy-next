import React from "react";
import useDeviceType from "~/components/zerodha/_hooks/useDeviceType";
import Header from "~/components/zerodha/hearder";
import WatchList from "./WatchList/page";

function Main({ children }: { children: React.ReactNode }) {
  const { isDeviceCompatible } = useDeviceType();

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center overflow-hidden  bg-background font-['Open_Sans','sans-serif']  ">
      <Header />
      {isDeviceCompatible("lg") ? null : <div className="flex h-full w-full  overflow-y-auto lg:hidden ">{children}</div>}

      {isDeviceCompatible("lg") && (
        <div className="hidden w-full max-w-[1536px] grow overflow-hidden lg:flex ">
          <WatchList />
          <div className={"flex max-w-[1110px] grow "}>
            <div className="w-full  border-r border-r-borderApp bg-background" style={{ scrollbarWidth: "none" }}>
              <div className="h-full w-full overflow-y-auto overflow-x-hidden">{children}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Main;
