"use client";
import { useContext, useEffect } from "react";
import DataContext from "../_contexts/data/data";
import useSocket from "../_hooks/useSocket";
import OrderForm from "./OrderForm/orderForm";
import RightSide from "./Rightside/RightSde";
import WatchList from "./WatchList/watchList";
import Header from "./hearder";
import { env } from "~/env";
import { useToast } from "../_contexts/Toast/toast-context";
// import { getCookie, getCookies } from "cookies-next";
export default function Home() {
  const { dataState, loading } = useContext(DataContext);
  // const cookie = getCookies();
  const toast = useToast();
  const { socket, isConnected, lastMessage } = useSocket(
    env.NEXT_PUBLIC_BACKEND_WS,
    dataState.userDetails?.TradingAccountId ?? "",
    {
      reconnectionDelay: 60000,
      reconnectionAttempts: 1,
      reconnection: false,
    },
  );
  useEffect(() => {
    if (toast && lastMessage && lastMessage !== "") {
      toast.open(JSON.stringify(lastMessage));
    }
  }, [lastMessage]);
  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center  bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow select-none overflow-hidden ">
        <WatchList />
        <div className={" flex max-w-[1110px] grow "}>
          <RightSide />
        </div>
      </div>
      <div className="w-full " style={{ wordWrap: "break-word" }}>
        {JSON.stringify({ ...dataState, loading })}
        {/* {JSON.stringify(status)} */}
      </div>
      {dataState.FormData.isvisible ? (
        <OrderForm
          symbol={dataState.FormData.symbol}
          type={dataState.FormData.type}
          sendMessage={(payload: string) => socket?.emit("order", payload)}
        />
      ) : null}
    </main>
  );
}
