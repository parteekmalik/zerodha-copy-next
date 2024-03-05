import { useContext, useEffect } from "react";
import SymbolLiveContext from "../_contexts/SymbolLive/SymbolLive";
import DataContext from "../_contexts/data/data";
import { Twsbinance } from "./WatchList/symbolInWL";
import { shadowBox } from "./tcss";

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
  const { dataDispatch, dataState } = useContext(DataContext);

  useEffect(() => {
    const msg: Twsbinance = {
      method: "SUBSCRIBE",
      params: [
        dataState.headerPin.Pin0 + "@trade",
        dataState.headerPin.Pin1 + "@trade",
      ],
      id: 1,
    };
    if (dataState.headerPin.Pin0) socketSend(msg);
    return () => {
      msg.method = "UNSUBSCRIBE";
      if (msg.params[0] !== "@trade") socketSend(msg);
    };
  }, [dataState.headerPin]);
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
                dataDispatch({
                  type: "update_rightHandSide",
                  payload: {
                    type: "chart",
                    symbol: dataState.headerPin.Pin0.toUpperCase(),
                    TimeFrame: "5",
                  },
                });
              }}
            >
              {dataState.headerPin.Pin0.toUpperCase()}
            </div>
            <div>
              {symbolLiveState.Livestream[dataState.headerPin.Pin0]?.curPrice}
            </div>
          </div>
          <div className="flex cursor-pointer gap-1">
            <div
              onClick={() => {
                dataDispatch({
                  type: "update_rightHandSide",
                  payload: {
                    type: "chart",
                    symbol: dataState.headerPin.Pin1.toUpperCase(),
                    TimeFrame: "5",
                  },
                });
              }}
            >
              {dataState.headerPin.Pin1.toUpperCase()}
            </div>
            <div>
              {symbolLiveState.Livestream[dataState.headerPin.Pin1]?.curPrice}
            </div>
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
                    (dataState.rightSideData.type === x ? "text-[#ff5722]" : "")
                  }
                  onClick={() => {
                    dataDispatch({
                      type: "update_rightHandSide",
                      payload: { type: x },
                    });
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
                  src={dataState.userDetails?.image ?? ""}
                  className="mr-1 cursor-pointer select-none rounded-full"
                  width="14px"
                  height="14px"
                ></img>
                <div>#{dataState.userDetails?.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
