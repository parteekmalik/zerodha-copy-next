import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SymbolLiveContext from "../_contexts/SymbolLive/SymbolLive";
import { Twsbinance } from "./WatchList/drag_drop_wishlist/symbolInWL";
import { shadowBox } from "./tcss";
import { AppDispatch, RootState } from "../_redux/store";
import { updateRightSide } from "../_redux/rightSideData/rightSideData";

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

  const { symbolLiveState, socketSend } = useContext(SymbolLiveContext);
  const headerPin = useSelector((state: RootState) => state.headerPin);
  const UserInfo = useSelector((state: RootState) => state.UserInfo);
  const rightSide = useSelector((state: RootState) => state.rightSide);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const msg: Twsbinance = {
      method: "SUBSCRIBE",
      params: [headerPin.Pin0 + "@trade", headerPin.Pin1 + "@trade"],
      id: 1,
    };
    if (headerPin.Pin0) socketSend(msg);
    return () => {
      msg.method = "UNSUBSCRIBE";
      if (msg.params[0] !== "@trade") socketSend(msg);
    };
  }, [headerPin]);
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
            <div>{symbolLiveState.Livestream[headerPin.Pin0]?.curPrice}</div>
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
            <div>{symbolLiveState.Livestream[headerPin.Pin1]?.curPrice}</div>
          </div>
        </div>
        <div className="flex h-full grow items-center ">
          <div className="flex  w-full border-r">
            <img
              className="ml-[30px] mr-[20px] h-[20px] w-auto"
              src="https://kite.zerodha.com/static/images/kite-logo.svg"
              alt=""
            />
            <div className="flex grow justify-end gap-4">
              {rightSideItems.map((x: RightSideType) => (
                <div
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
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-full items-center  p-4">
            <div className="flex gap-4">
              <img
                className="cursor-pointer select-none"
                width="14px"
                height="14px"
                src="https://img.icons8.com/material-outlined/24/filled-appointment-reminders.png"
                alt="filled-appointment-reminders"
              />
              <div className="flex cursor-pointer text-center ">
                <img
                  src={UserInfo?.image ?? ""}
                  className="mr-1 cursor-pointer select-none rounded-full"
                  width="14px"
                  height="14px"
                ></img>
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
