import { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import WifiIcon from "./savages/WifiIcon";
import { shadowBox } from "./tcss";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

type RightSideType =
  | "Dashboard"
  | "Orders"
  | "Holdings"
  | "Positions"
  | "Funds";

function Header() {
  const rightSideItems: RightSideType[] = [
    "Dashboard",
    "Orders",
    "Holdings",
    "Positions",
    "Funds",
  ];

  const { backendServerConnection } = useContext(BackndWSContext);
  const headerPin = useSelector((state: RootState) => state.headerPin);
  const Livestream = useSelector((state: RootState) => state.Livestream);
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  const dispatch = useDispatch<AppDispatch>();

  const PinData = useMemo(
    () => ({
      first: {
        name: headerPin.Pin0.toUpperCase(),
        isgreen: Livestream[headerPin.Pin0]?.isup,
        price: Livestream[headerPin.Pin0]?.curPrice,
      },
      second: {
        name: headerPin.Pin1.toUpperCase(),
        isgreen: Livestream[headerPin.Pin1]?.isup,
        price: Livestream[headerPin.Pin1]?.curPrice,
      },
    }),
    [Livestream, headerPin],
  );
  // ff5722
  const temp = usePathname();
  const route = useMemo(() => {
    const data = temp.split("/");

    return data[data.length - 1];
  }, [temp]);
  return (
    <header
      className={" flex w-full justify-center bg-white text-xs " + shadowBox}
    >
      <div className="flex min-h-[60px] w-full max-w-[1536px]">
        <div className="flex h-full min-w-[430px] items-center justify-around  gap-5 border-r text-base uppercase">
          <div className="flex cursor-pointer gap-2 ">
            <Link href={`Chart?symbol=${PinData.first.name}&TimeFrame=${5}`}>
              {headerPin.Pin0}
            </Link>
            <div
              className={`${
                PinData.first.isgreen ? "text-greenApp" : "text-redApp"
              }`}
            >
              {PinData.first.price}
            </div>
          </div>
          <div className="flex cursor-pointer gap-2">
            <Link href={`Chart?symbol=${PinData.second.name}&TimeFrame=${5}`}>
              {headerPin.Pin1}
            </Link>
            <div
              className={`${
                PinData.second.isgreen ? "text-greenApp" : "text-redApp"
              }`}
            >
              {PinData.second.price}
            </div>
          </div>
        </div>
        <div className="flex h-full grow items-center justify-between ">
          <div className="flex   ">
            <Image
              className="ml-[30px] mr-[20px] "
              src="https://kite.zerodha.com/static/images/kite-logo.svg"
              alt=""
              width={30}
              height={20}
            />

            <div className=" h-[20px] w-[20px]">
              <WifiIcon
                color={
                  backendServerConnection === "connected" ? "green" : "red"
                }
                size={"20px"}
              />
            </div>
          </div>
          <div className="flex h-full items-center  p-4">
            <div className="flex gap-4">
              <nav className=" border-r ">
                {rightSideItems.map((x: RightSideType) => (
                  <Link
                    href={"/" + x}
                    className={
                      "cursor-pointer select-none px-[15px] text-center hover:text-[#ff5722] " +
                      (route === x ? "text-[#ff5722]" : "")
                    }
                    key={x}
                  >
                    {x}
                  </Link>
                ))}
              </nav>
              <Image
                className="cursor-pointer select-none"
                width={14}
                height={14}
                src="https://img.icons8.com/material-outlined/24/filled-appointment-reminders.png"
                alt="filled-appointment-reminders"
              />
              <div className="flex cursor-pointer text-center ">
                {UserInfo.image && UserInfo.image !== "not_found" && (
                  <Image
                    src={UserInfo.image ?? ""}
                    alt="user-icon"
                    className="mr-1 cursor-pointer select-none rounded-full"
                    width={14}
                    height={14}
                  />
                )}
                <div>#{UserInfo?.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
