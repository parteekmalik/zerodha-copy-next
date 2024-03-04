"use client";
import { useContext, useEffect } from "react";
import { api } from "~/trpc/react";
import DataContext from "../_contexts/data/data";
import OrderForm from "./OrderForm/orderForm";
import RightSide from "./Rightside/RightSde";
import WatchList from "./WatchList/watchList";
import Header from "./hearder";
import TempOrderForm from "./OrderForm/orderForm";

export default function Home() {
  const { dataState } = useContext(DataContext);

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow select-none overflow-hidden ">
        <WatchList />
        <div className={" flex max-w-[1110px] grow"}>
          <RightSide />
        </div>
      </div>
      <div>{JSON.stringify(dataState)}</div>
      {dataState.FormData.isvisible ? (
        <OrderForm
          symbol={dataState.FormData.symbol}
          type={dataState.FormData.type}
        />
      ) : null}
      {dataState.FormData.isvisible ? (
        <TempOrderForm
          symbol={dataState.FormData.symbol}
          type={dataState.FormData.type}
        />
      ) : null}
    </main>
  );
}
