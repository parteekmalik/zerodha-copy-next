import React from "react";
import { useSelector } from "react-redux";
import TempOrderForm from "~/components/zerodha/OrderForm/orderForm";
import { greaterThan } from "~/components/zerodha/_redux/Slices/DeviceType";
import { RootState } from "~/components/zerodha/_redux/store";
import Header from "~/components/zerodha/hearder";
import WatchList from "./WatchList/page";

function Main({ children }: { children: React.ReactNode }) {
  const DeviceType = useSelector((state: RootState) => state.DeviceType);

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center overflow-hidden  bg-background font-['Open_Sans','sans-serif']  ">
      <Header />
      {greaterThan("lg", DeviceType) ? null : (
        <div className="flex h-full w-full  overflow-y-auto lg:hidden ">
          {children}
        </div>
      )}

      {greaterThan("lg", DeviceType) && (
        <div className="hidden w-full max-w-[1536px] grow overflow-hidden lg:flex ">
          <WatchList />
          <div className={"flex max-w-[1110px] grow "}>
            <div
              className="w-full overflow-y-auto overflow-x-hidden bg-background"
              style={{ scrollbarWidth: "none" }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
      {greaterThan("lg", DeviceType) && <TempOrderForm />}
    </main>
  );
}

export default Main;
