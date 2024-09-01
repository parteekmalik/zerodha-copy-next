"use client";
import BackendWSContextComponent from "../components/zerodha/_contexts/backendWS/backendWSContextComponent";
import { ToastProvider } from "../components/zerodha/_contexts/Toast/toast";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import Header from "~/components/zerodha/hearder";
import TempOrderForm from "~/components/zerodha/OrderForm/orderForm";
import WatchList from "~/components/zerodha/WatchList/watchList";
import { store } from "../components/zerodha/_redux/store";
import StoreComponent from "../components/zerodha/_redux/storeComponent";
import { api } from "~/trpc/react";

export default function ContextLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  const route = useMemo(() => {
    const data = path.split("/");

    return data[data.length - 1];
  }, [path]);

  if (route === "") {
    router.push("/Dashboard");
  }
  return (
    <>
      {route === "login" || route === "logout" ? (
        <>{children}</>
      ) : (
        <ToastProvider>
          <Provider store={store}>
            {/* <BackendWSContextComponent> */}
            <StoreComponent />
            <main className=" max-w-screen bg-lightGrayApp flex h-screen max-h-screen w-screen flex-col  items-center justify-center  overflow-hidden font-['Open_Sans','sans-serif']  ">
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
                {/* {route} */}
                {/* {JSON.stringify({ ...dataState, loading })} */}
                {/* {JSON.stringify(status)} */}
              </div>
              <TempOrderForm />
            </main>
            {/* </BackendWSContextComponent> */}
          </Provider>
        </ToastProvider>
      )}
    </>
  );
}
