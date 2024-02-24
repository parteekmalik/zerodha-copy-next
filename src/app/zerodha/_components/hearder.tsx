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
        dataState.headerPin[0] + "@trade",
        dataState.headerPin[1] + "@trade",
      ],
      id: 1,
    };

    socketSend(msg);
  }, []);
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
                    symbol: dataState.headerPin[0].toUpperCase(),
                    TimeFrame: "5",
                  },
                });
              }}
            >
              {dataState.headerPin[0].toUpperCase()}
            </div>
            <div>
              {parseFloat(
                symbolLiveState.Livestream.BTCUSDT
                  ? symbolLiveState.Livestream.BTCUSDT.c
                  : "00.0",
              ).toFixed(2)}
            </div>
          </div>
          <div className="flex cursor-pointer gap-1">
            <div
              onClick={() => {
                dataDispatch({
                  type: "update_rightHandSide",
                  payload: {
                    type: "chart",
                    symbol: dataState.headerPin[1].toUpperCase(),
                    TimeFrame: "5",
                  },
                });
              }}
            >
              {dataState.headerPin[1].toUpperCase()}
            </div>
            <div>
              {parseFloat(
                symbolLiveState.Livestream.ETHUSDT
                  ? symbolLiveState.Livestream.ETHUSDT.c
                  : "00.0",
              ).toFixed(2)}
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
              <div className="flex cursor-pointer text-center">
                <img src={dataState.userDetails?.image ?? ""}></img>
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
