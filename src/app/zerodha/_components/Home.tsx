"use client";
import { useContext, useEffect } from "react";
import DataContext from "../_contexts/data/data";
import type { TuserDetails } from "../_contexts/data/data";
import OrderForm from "./OrderForm/orderForm";
import RightSide from "./Rightside/RightSde";
import WatchList from "./WatchList/watchList";
import Debugdata from "./debugdata";
import Header from "./hearder";

interface IHome {
  watchlist: string[][];
  userDetails: TuserDetails;
}
export default function Home({ watchlist, userDetails }: IHome) {
  const { dataDispatch } = useContext(DataContext);

  useEffect(() => {
    if (watchlist && userDetails) {
      dataDispatch({ type: "update_userDetails", payload: userDetails });
      dataDispatch({ type: "update_watchList", payload: watchlist });
    }
  }, [watchlist, userDetails]);

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow select-none ">
        <WatchList />
        <div className={" flex max-w-[1110px] grow"}>
          <RightSide />
        </div>
      </div>
      <Debugdata />
      <OrderForm />
    </main>
  );
}
