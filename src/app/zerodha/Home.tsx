"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../components/zerodha/_redux/store";
import Header from "~/components/zerodha/hearder";
import RightSide from "~/components/zerodha/Rightside/RightSde";
import WatchList from "~/components/zerodha/WatchList/watchList";
import TempOrderForm from "~/components/zerodha/OrderForm/orderForm";
// import { getCookie, getCookies } from "cookies-next";
export default function Home() {
  // const cookie = getCookies();
  const FormData = useSelector((state: RootState) => state.FormData);

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center  justify-center overflow-hidden  bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow overflow-hidden ">
        <WatchList />
        <div className={" flex max-w-[1110px] grow "}>
          <div
            className="w-full overflow-y-auto overflow-x-hidden bg-white"
            style={{ scrollbarWidth: "none" }}
          >
            <RightSide />
          </div>
        </div>
      </div>
      <div className="w-full " style={{ wordWrap: "break-word" }}>
        {/* {JSON.stringify({ ...dataState, loading })} */}
        {/* {JSON.stringify(status)} */}
      </div>
      {FormData.isvisible ? (
        <TempOrderForm symbol={FormData.symbol} type={FormData.type} />
      ) : null}
    </main>
  );
}