"use client";
import { useContext } from "react";
import type { TuserDetails } from "../_contexts/data/data";
import DataContext from "../_contexts/data/data";
import OrderForm from "./OrderForm/orderForm";
import RightSide from "./Rightside/RightSde";
import WatchList from "./WatchList/watchList";
import Debugdata from "./debugdata";
import Header from "./hearder";

interface IHome {
  watchlist: string[][];
  userDetails: TuserDetails;
}
export default function Home() {
  const { dataDispatch } = useContext(DataContext);

  // const watchlist = api.accountInfo.watchList.useQuery().data ?? [];
  // const userInfo = api.accountInfo.info.useQuery().data ?? {
  //   name: "not_found",
  //   email: "not_found@gmail.com",
  //   image: "not_found",
  //   id: "not_found",
  // };
  // useEffect(() => {
  //   if (userInfo.id !== "not_found")
  //     dataDispatch({ type: "update_userDetails", payload: userInfo });
  //   if (watchlist.length !== 0)
  //     dataDispatch({ type: "update_watchList", payload: watchlist });
  // }, [watchlist, userInfo]);

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
