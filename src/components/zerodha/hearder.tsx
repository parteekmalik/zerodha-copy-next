import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { updateRightSide } from "~/components/zerodha/_redux/Slices/rightSideData";
import { AppDispatch, RootState } from "~/components/zerodha/_redux/store";
import WifiIcon from "./savages/WifiIcon";
import { shadowBox } from "./tcss";
import Image from "next/image";
import Link from "next/link";

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
  const rightSide = useSelector((state: RootState) => state.rightSide);
  const dispatch = useDispatch<AppDispatch>();

  // ff5722

  return (
    <header
      className={" flex w-full justify-center bg-white text-xs " + shadowBox}
    >
      <div className="flex min-h-[60px] w-full max-w-[1536px]">
        <div className="flex h-full min-w-[430px] items-center justify-center gap-5 border-r">
          <div className="flex cursor-pointer gap-1 ">
            <div
              onClick={() => {
                dispatch(
                  updateRightSide({
                    type: "chart",
                    symbol: headerPin.Pin0.toUpperCase(),
                    TimeFrame: "5",
                  }),
                );
              }}
            >
              {headerPin.Pin0.toUpperCase()}
            </div>
            <div>{Livestream[headerPin.Pin0]?.curPrice}</div>
          </div>
          <div className="flex cursor-pointer gap-1">
            <div
              onClick={() => {
                dispatch(
                  updateRightSide({
                    type: "chart",
                    symbol: headerPin.Pin1.toUpperCase(),
                    TimeFrame: "5",
                  }),
                );
              }}
            >
              {headerPin.Pin1.toUpperCase()}
            </div>
            <div>{Livestream[headerPin.Pin1]?.curPrice}</div>
          </div>
        </div>
        <div className="flex h-full grow items-center ">
          <div className="flex  w-full border-r">
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
            <div className="flex grow justify-end gap-4">
              {rightSideItems.map((x: RightSideType) => (
                <Link
                  href={"/zerodha/" + x}
                  className={
                    "cursor-pointer select-none px-[15px] text-center hover:text-[#ff5722] " +
                    (rightSide.type === x ? "text-[#ff5722]" : "")
                  }
                  onClick={() => {
                    dispatch(updateRightSide({ type: x }));
                  }}
                  key={x}
                >
                  {x}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex h-full items-center  p-4">
            <div className="flex gap-4">
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
