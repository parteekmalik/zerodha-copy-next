"use client";
import Logout from "@mui/icons-material/Logout";
import SupportIcon from "@mui/icons-material/Support";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { type RootState } from "~/components/zerodha/_redux/store";
import { shadowBox } from "~/components/zerodha/tcss";
import ThemeSwitch from "~/components/zerodha/ThemeSwitch";
import InfoHover from "../ui/infoHover";

const baseURL = "/v2/";

function Header() {
  const route = usePathname().split("/").pop();

  return (
    <header className={twMerge("flex w-full justify-center border-b-2 border-blue-500 bg-background", shadowBox)}>
      <div className="flex w-full p-2 px-4 pb-0">
        <div className="relative flex h-full grow items-center">
          <div className="flex grow items-center justify-center gap-5  lg:grow-0">
            <Image className=" " src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="" width={30} height={20} />

            <p className="mx-auto lg:hidden">{route}</p>
          </div>
          <NavigationButtons route={"Spot"} />
        </div>
      </div>
    </header>
  );
}

export default Header;
const Routes = [
  { name: "Spot", icon: "" },
  { name: "Quick", icon: "" },
  { name: "Wallet", icon: "" },
];
function NavigationButtons({ route }: { route: string }) {
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  return (
    <nav className="flex justify-between items-center grow mx-6">
      <div className="relative hidden h-full  items-center lg:flex  ">
        {Routes.map((x) => (
          <Link
            href={baseURL + x.name}
            className={twMerge(
              "relative rounded-t-lg px-4 mx-2 py-2",
              route === x.name && [
                "bg-blue-500 relative",
                "before:absolute before:bottom-0 before:left-[-30px] before:h-[30px] before:w-[30px] before:rounded-full before:bg-background before:shadow-[15px_15px_0_#3B82F6]",
                "after:absolute after:bottom-0 after:right-[-30px] after:h-[30px] after:w-[30px] after:rounded-full after:bg-background after:shadow-[-15px_15px_0_#3B82F6] ",
              ],
            )}
            key={x.name}
          >
            {x.name}
          </Link>
        ))}
      </div>

      <div>
        <ThemeSwitch />
      </div>

      <div className="flex gap-4">
        <InfoHover
          options={{ isClickEnabled: true, position: "right" }}
          info={
            <div className="flex gap-4 hover:cursor-pointer hover:text-orangeApp">
              <Avatar
                sx={{ width: 24, height: 24 }}
                {...(UserInfo.image && UserInfo.image !== "not_found" ? { src: UserInfo.image } : { children: "N" })}
                alt="user-icon"
              />

              <div className="hidden max-w-[100px] truncate md:block">#{UserInfo.TradingAccountId}</div>
            </div>
          }
        >
          <div className="mt-4  min-w-[200px] rounded-md border border-borderApp bg-background py-1  text-foreground ">
            <div className="m-1 flex items-center justify-between bg-blueApp/10 p-1 px-2 ">
              <div className="flex flex-col">
                <span className="uppercase">{UserInfo.name}</span>
                <span className="text-foreground/75">{UserInfo.email ?? "not provided"}</span>
              </div>
              <Link href={"/v1/Profile"}>{">"}</Link>
            </div>

            <ul className="w-full appearance-none lg:hidden ">
              {[{ name: "WatchList", icon: "" }, ...Routes].map((item) => (
                <Link href={item.name} key={item.name} className="flex w-full gap-4 p-1 px-3 hover:bg-blueApp/10">
                  {item.icon && <div className="fill-foreground ">{item.icon}</div>}
                  <span> {item.name}</span>
                </Link>
              ))}
            </ul>
            <ul className="w-full appearance-none ">
              {[{ url: "/console", name: "Console", icon: <SupportIcon /> }].map((item) => (
                <Link href={item.url} key={item.name} className="flex w-full gap-4 p-1 px-3 hover:bg-blueApp/10">
                  {item.icon && <div className="fill-foreground ">{item.icon}</div>}
                  <span> {item.name}</span>
                </Link>
              ))}
            </ul>
            <ul className="w-full appearance-none ">
              {[
                { url: "/support", name: "Support", icon: <SupportIcon /> },
                { url: "/api/auth/signout", name: "Logout", icon: <Logout /> },
              ].map((item) => (
                <Link href={item.url} key={item.name} className="flex w-full gap-4 p-1 px-3 hover:bg-blueApp/10">
                  {item.icon && <div className="fill-foreground ">{item.icon}</div>}
                  <span> {item.name}</span>
                </Link>
              ))}
            </ul>
          </div>
        </InfoHover>
      </div>
    </nav>
  );
}
