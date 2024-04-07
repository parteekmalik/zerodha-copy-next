"use client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import OrderForm from "./OrderForm/orderForm";
import RightSide from "./Rightside/RightSde";
import WatchList from "./WatchList/watchList";
import Header from "./hearder";
// import { getCookie, getCookies } from "cookies-next";
export default function Home() {
  // const cookie = getCookies();
  const FormData = useSelector((state: RootState) => state.FormData);

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center  justify-center overflow-hidden  bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow select-none overflow-hidden ">
        <WatchList />
        <div className={" flex max-w-[1110px] grow "}>
          <div className="w-full overflow-y-auto overflow-x-hidden">
            <RightSide />
          </div>
        </div>
      </div>
      <div className="w-full " style={{ wordWrap: "break-word" }}>
        {/* {JSON.stringify({ ...dataState, loading })} */}
        {/* {JSON.stringify(status)} */}
      </div>
      {FormData.isvisible ? (
        <OrderForm symbol={FormData.symbol} type={FormData.type} />
      ) : null}
    </main>
  );
}
