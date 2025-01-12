"use client";
import Logout from "@mui/icons-material/Logout";
import SupportIcon from "@mui/icons-material/Support";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { type RootState } from "~/components/zerodha/_redux/store";
import ThemeSwitch from "~/components/zerodha/ThemeSwitch";

import { Popover, PopoverContent, PopoverTrigger } from "~/components/v2/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "~/components/v2/ui/tabs";

const baseURL = "/v2/";

function Header() {
  const lastRoute = usePathname().split("/").pop();

  return (
    <header
      className={twMerge(
        "relative flex w-full justify-center border-b-4 border-primary bg-background",
        "after:h-[50px] after:absolute after:top-[calc(100%+3px)] after:left-0 after:w-full after:bg-[#1a283f]",
      )}
    >
      <div className="flex w-full p-2 px-4 pb-0">
        <div className="relative flex h-full grow items-center">
          <div className="flex grow items-center justify-center gap-5  lg:grow-0">
            <Image className=" " src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="" width={30} height={20} />

            <p className="mx-auto lg:hidden">{lastRoute}</p>
          </div>
          <NavigationButtons lastRoute={lastRoute} fullRoute={usePathname()} />
        </div>
      </div>
    </header>
  );
}

export default Header;
const Routes = [
  { url: "spot", name: "Spot", icon: "" },
  { url: "quick", name: "Quick", icon: "" },
  { url: "wallet", name: "Wallet", icon: "" },
];
function NavigationButtons({ lastRoute, fullRoute }: { lastRoute?: string; fullRoute: string }) {
  const router = useRouter();
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  const currentVersion = fullRoute.split("/").includes("v1") ? "v1" : "v2";
  const changeVersion = (value: string) => {
    if (currentVersion !== value) {
      router.push(fullRoute.replace(currentVersion, value));
    }
  };
  return (
    <nav className="mx-6 flex grow items-center justify-between">
      <div className="relative hidden h-full  items-center lg:flex  ">
        {Routes.map((x) => (
          <Link
            href={baseURL + x.url}
            className={twMerge(
              "relative mx-2 rounded-t-lg px-5 py-2",
              lastRoute === x.url && [
                "relative bg-primary text-white",
                "before:absolute before:bottom-0 before:left-[-30px] before:h-[30px] before:w-[30px] before:rounded-full before:bg-background before:shadow-[15px_15px_0_hsl(var(--primary))]",
                "after:absolute after:bottom-0 after:right-[-30px] after:h-[30px] after:w-[30px] after:rounded-full after:bg-background after:shadow-[-15px_15px_0_hsl(var(--primary))] ",
              ],
            )}
            key={x.name}
          >
            {x.name}
          </Link>
        ))}
      </div>

      <div className="flex h-full flex-row items-center gap-2">
        <ThemeSwitch className="border-r px-2" />
        <Tabs onValueChange={changeVersion} defaultValue={currentVersion} className="">
          <TabsList>
            <TabsTrigger className="dark:data-[state=active]:bg-primary" value="v1">
              V1
            </TabsTrigger>
            <TabsTrigger className="dark:data-[state=active]:bg-primary" value="v2">
              V2
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex gap-4 hover:cursor-pointer hover:text-orangeApp">
            <Avatar
              sx={{ width: 24, height: 24 }}
              {...(UserInfo.image && UserInfo.image !== "not_found" ? { src: UserInfo.image } : { children: "N" })}
              alt="user-icon"
            />

            <div className="hidden max-w-[100px] truncate md:block">#{UserInfo.TradingAccountId}</div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="mt-4 min-w-[200px] rounded-md border border-borderApp bg-background py-1 text-foreground">
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
        </PopoverContent>
      </Popover>
    </nav>
  );
}
