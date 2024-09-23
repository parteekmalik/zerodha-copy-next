import Logout from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SupportIcon from "@mui/icons-material/Support";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { getColor } from "~/app/kite/utils";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import InfoHover from "../ui/infoHover";
import { useBackendWS } from "./_contexts/backendWS/backendWSContextComponent";
import { useBinanceLiveData } from "./_contexts/LiveData/useBinanceLiveData";
import { updateSeprateSubscriptions } from "./_redux/Slices/BinanceWSStats";
import WifiIcon from "./savages/WifiIcon";
import { shadowBox } from "./tcss";
import ThemeSwitch from "./ThemeSwitch";

const baseURL = "/kite/";

function Header() {
  const { backendServerConnection } = useBackendWS();
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
        isgreen: Number(Livestream[headerPin.Pin0]?.PriceChange) ?? 0,
        price: Livestream[headerPin.Pin0]?.curPrice,
        change: Livestream[headerPin.Pin0]?.PriceChangePercent,
      },
      second: {
        name: headerPin.Pin1.toUpperCase(),
        isgreen: Number(Livestream[headerPin.Pin1]?.PriceChange) ?? 0,
        price: Livestream[headerPin.Pin1]?.curPrice,
        change: Livestream[headerPin.Pin1]?.PriceChangePercent,
      },
    }),
    [Livestream, headerPin],
  );
  // ff5722
  const route = usePathname().split("/").pop();

  return (
    <header
      className={twMerge("flex w-full justify-center bg-background", shadowBox)}
    >
      <div className="flex min-h-[60px] w-full max-w-[1536px]">
        <div className="hidden h-full min-w-[430px] items-center justify-around gap-5 border-b border-r border-borderApp text-base uppercase lg:flex">
          <div className="flex cursor-pointer gap-2 ">
            <Link href={`Chart?symbol=${PinData.first.name}&TimeFrame=${5}`}>
              {PinData.first.name}
            </Link>
            <div className={`flex gap-1 ${getColor(PinData.first.isgreen)} `}>
              <p>{PinData.first.price}</p>
              <span>({PinData.first.change}%)</span>
            </div>
          </div>
          <div className="flex cursor-pointer gap-2">
            <Link href={`Chart?symbol=${PinData.second.name}&TimeFrame=${5}`}>
              {PinData.second.name}
            </Link>
            <div className={`flex gap-1 ${getColor(PinData.second.isgreen)}`}>
              <p>{PinData.second.price}</p>
              <span>({PinData.second.change}%)</span>
            </div>
          </div>
        </div>
        <div className="relative flex h-full grow items-center border-b  border-borderApp ">
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
                <WifiIcon
                  color={
                    backendServerConnection === "connected" ? "green" : "red"
                  }
                  size={"20px"}
                />
              }
            >
              {backendServerConnection === "connected"
                ? "backend server is up"
                : "backend server is down"}
              {/* TODO: ( pending order will execute while page is open ) */}
            </InfoHover>
            <p className="mx-auto lg:hidden">{route}</p>
            <ThemeSwitch />
          </div>
          <NavigationNav route={route ?? "404"} />
        </div>
      </div>
    </header>
  );
}

export default Header;
const rightSideItems = [
  { name: "Dashboard", icon: "" },
  { name: "Orders", icon: "" },
  { name: "Holdings", icon: "" },
  { name: "Positions", icon: "" },
  { name: "Funds", icon: "" },
];
function NavigationNav({ route }: { route: string }) {
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  return (
    <>
      <div className="ml-auto hidden h-full items-center p-4  lg:flex">
        <div className="flex gap-4 ">
          <nav className=" border-r ">
            {rightSideItems.map((x) => (
              <Link
                href={baseURL + x.name}
                className={
                  "cursor-pointer select-none px-[15px] text-center hover:text-orangeApp " +
                  (route === x.name ? "text-orangeApp" : "")
                }
                key={x.name}
              >
                {x.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex gap-4 p-4 pl-0">
        <Notifications />
        <InfoHover
          options={{ isClickEnabled: true, position: "right" }}
          info={
            <div className="flex gap-4 hover:cursor-pointer hover:text-orangeApp">
              <Avatar
                sx={{ width: 24, height: 24 }}
                {...(UserInfo.image && UserInfo.image !== "not_found"
                  ? { src: UserInfo.image }
                  : { children: "N" })}
                alt="user-icon"
              />

              <div className="hidden max-w-[100px] truncate md:block">
                #{UserInfo.TradingAccountId}
              </div>
            </div>
          }
        >
          <div className="mt-4  min-w-[200px] rounded-md border border-borderApp bg-background py-1  text-foreground ">
            <div className="m-1 flex items-center justify-between bg-blueApp/10 p-1 px-2 ">
              <div className="flex flex-col">
                <span className="uppercase">{UserInfo.name}</span>
                <span className="text-foreground/75">
                  {UserInfo.email ?? "not provided"}
                </span>
              </div>
              <Link href={"/kite/Profile"}>{">"}</Link>
            </div>

            <ul className="w-full appearance-none lg:hidden ">
              {[{ name: "WatchList", icon: "" }, ...rightSideItems].map(
                (item) => (
                  <Link
                    href={item.name}
                    key={item.name}
                    className="flex w-full gap-4 p-1 px-3 hover:bg-blueApp/10"
                  >
                    {item.icon && (
                      <div className="fill-foreground ">{item.icon}</div>
                    )}
                    <span> {item.name}</span>
                  </Link>
                ),
              )}
            </ul>
            <ul className="w-full appearance-none ">
              {[
                { url: "/console", name: "Console", icon: <SupportIcon /> },
              ].map((item) => (
                <Link
                  href={item.url}
                  key={item.name}
                  className="flex w-full gap-4 p-1 px-3 hover:bg-blueApp/10"
                >
                  {item.icon && (
                    <div className="fill-foreground ">{item.icon}</div>
                  )}
                  <span> {item.name}</span>
                </Link>
              ))}
            </ul>
            <ul className="w-full appearance-none ">
              {[
                { url: "/support", name: "Support", icon: <SupportIcon /> },
                { url: "/api/auth/signout", name: "Logout", icon: <Logout /> },
              ].map((item) => (
                <Link
                  href={item.url}
                  key={item.name}
                  className="flex w-full gap-4 p-1 px-3 hover:bg-blueApp/10"
                >
                  {item.icon && (
                    <div className="fill-foreground ">{item.icon}</div>
                  )}
                  <span> {item.name}</span>
                </Link>
              ))}
            </ul>
          </div>
        </InfoHover>
      </div>
    </>
  );
}
function Notifications({ className }: { className?: string }) {
  return (
    <NotificationsNoneIcon
      className={twMerge(
        "fill-foreground hover:cursor-pointer hover:fill-orangeApp",
        className,
      )}
    />
  );
}
