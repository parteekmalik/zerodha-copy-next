import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import InfoHover from "../ui/infoHover";
import { useBinanceLiveData } from "./_contexts/LiveData/useBinanceLiveData";
import { updateSeprateSubscriptions } from "./_redux/Slices/BinanceWSStats";
import WifiIcon from "./savages/WifiIcon";
import { shadowBox } from "./tcss";
import ThemeSwitch from "./ThemeSwitch";

const baseURL = "/kite/";
const rightSideItems = [
  "Dashboard",
  "Orders",
  "Holdings",
  "Positions",
  "Funds",
];
function Header() {
  const { backendServerConnection } = useContext(BackndWSContext);
  const headerPin = useSelector((state: RootState) => state.headerPin);
  const { Livestream } = useBinanceLiveData();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(
      updateSeprateSubscriptions({
        name: "headers",
        subsription: [headerPin.Pin0, headerPin.Pin1],
      }),
    );
  }, [headerPin]);

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
  const route = usePathname().split("/").pop();

  return (
    <header
      className={"  flex w-full justify-center bg-background " + shadowBox}
    >
      <div className="flex min-h-[60px] w-full max-w-[1536px]">
        <div className="hidden h-full min-w-[430px] items-center justify-around gap-5 border-b border-r border-borderApp text-base uppercase lg:flex">
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
        <div className="relative flex h-full grow items-center justify-between border-b  border-borderApp ">
          <div className="flex grow items-center justify-center gap-5  p-4 lg:grow-0">
            <Image
              className=" "
              src="https://kite.zerodha.com/static/images/kite-logo.svg"
              alt=""
              width={30}
              height={20}
            />

            <InfoHover
              info={
                backendServerConnection === "connected"
                  ? "backend server is up"
                  : "backend server is down"
              }
            >
              {/* TODO: ( pending order will execute while page is open ) */}
              <WifiIcon
                color={
                  backendServerConnection === "connected" ? "green" : "red"
                }
                size={"20px"}
              />
            </InfoHover>
            <p className="mx-auto">{route}</p>
            <ThemeSwitch />
            <Notifications className="lg:hidden" />
          </div>
          <NavigationNav route={route ?? "404"} />
        </div>
      </div>
    </header>
  );
}

export default Header;

function NavigationNav({ route }: { route: string }) {
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  const [isopened, setisopened] = useState(false);
  return (
    <>
      <div
        className="p-4 lg:hidden"
        onClick={() => setisopened((prev) => !prev)}
      >
        <Avatar
          sx={{ width: 24, height: 24 }}
          src={UserInfo.image ?? ""}
          alt="user-icon"
        />
      </div>
      {isopened && (
        <div
          className="absolute left-0  top-full z-50 flex w-full flex-col  bg-background text-foreground "
          style={{ height: "calc(100dvh - 100%)" }}
        >
          {["WatchList", ...rightSideItems].map((pageLink) => (
            <Link
              href={baseURL + pageLink}
              onClick={() => setisopened(false)}
              className={twMerge(
                " w-full border-b  border-borderApp p-[15px] text-center",
                route === pageLink ? "text-orangeApp" : "",
              )}
              key={pageLink}
            >
              {pageLink}
            </Link>
          ))}
        </div>
      )}
      <div className="hidden h-full items-center p-4  lg:flex">
        <div className="flex gap-4 ">
          <nav className=" border-r ">
            {rightSideItems.map((x) => (
              <Link
                href={baseURL + x}
                className={
                  "cursor-pointer select-none px-[15px] text-center hover:text-orangeApp " +
                  (route === x ? "text-orangeApp" : "")
                }
                key={x}
              >
                {x}
              </Link>
            ))}
          </nav>
          <Notifications />
          {UserInfo.image && UserInfo.image !== "not_found" && (
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={UserInfo.image ?? ""}
              alt="user-icon"
            />
          )}
          <div className="max-w-[100px] truncate">
            #{UserInfo.TradingAccountId}
          </div>
        </div>
      </div>
    </>
  );
}
function Notifications({ className }: { className?: string }) {
  return (
    <NotificationsNoneIcon className={twMerge("fill-foreground", className)} />
  );
}
