"use client";
import BackendWSContextComponent from "../../components/zerodha/_contexts/backendWS/backendWSContextComponent";
import { ToastProvider } from "../../components/zerodha/_contexts/Toast/toast";

import { redirect, usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { Provider } from "react-redux";
import Header from "~/components/zerodha/hearder";
import TempOrderForm from "~/components/zerodha/OrderForm/orderForm";
import WatchList from "~/components/zerodha/WatchList/watchList";
import { store } from "../../components/zerodha/_redux/store";
import StoreComponent from "../../components/zerodha/_redux/storeComponent";

export default function ContextLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const temp = usePathname();
  useLayoutEffect(() => {
    const data = temp.split("/");
    if (data[data.length - 1] === "zerodha") {
      redirect("/");
    }
  }, [temp]);
  return (
    <ToastProvider>
      <Provider store={store}>
        <BackendWSContextComponent>
          <StoreComponent />
          <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center  justify-center overflow-hidden  bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
            <Header />
            <div className="text-red flex w-full max-w-[1536px] grow overflow-hidden ">
              <WatchList />
              <div className={" flex max-w-[1110px] grow "}>
                <div
                  className="w-full overflow-y-auto overflow-x-hidden bg-white"
                  style={{ scrollbarWidth: "none" }}
                >
                  {children}
                </div>
              </div>
            </div>
            <div className="w-full " style={{ wordWrap: "break-word" }}>
              {/* {JSON.stringify({ ...dataState, loading })} */}
              {/* {JSON.stringify(status)} */}
            </div>
            <TempOrderForm />
          </main>
        </BackendWSContextComponent>
      </Provider>
    </ToastProvider>
  );
}
