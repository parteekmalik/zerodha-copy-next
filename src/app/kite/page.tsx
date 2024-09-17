"use client";
import { ToastProvider } from "../../components/zerodha/_contexts/Toast/toast";

import { Provider } from "react-redux";
import BinanceWSContextComponent from "~/components/zerodha/_contexts/LiveData/BinanceWSContextComponent";
import Header from "~/components/zerodha/hearder";
import TempOrderForm from "~/components/zerodha/OrderForm/orderForm";
import WatchList from "~/app/kite/WatchList/page";
import { store } from "../../components/zerodha/_redux/store";
import StoreComponent from "../../components/zerodha/_redux/storeComponent";

export default function ContextLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <BinanceWSContextComponent>
        <Provider store={store}>
          {/* <BackendWSContextComponent> */}
          <StoreComponent />
          <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center  justify-center overflow-hidden  bg-background font-['Open_Sans','sans-serif']  ">
            <Header />
            <div className="flex h-full w-full  overflow-y-auto lg:hidden ">
              {children}
            </div>
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
            <div className="w-full " style={{ wordWrap: "break-word" }}>
              {/* {route} */}
              {/* {JSON.stringify({ ...dataState, loading })} */}
              {/* {JSON.stringify(status)} */}
            </div>
            <TempOrderForm />
          </main>
          {/* </BackendWSContextComponent> */}
        </Provider>
      </BinanceWSContextComponent>
    </ToastProvider>
  );
}
