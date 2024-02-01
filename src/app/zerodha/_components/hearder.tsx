import { useContext, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import SymbolLiveContext from "../_contexts/SymbolLive/SymbolLive";
import type { Tdata } from "../page";
import { shadowBox } from "./tcss";

type RightSideType =
  | "Dashboard"
  | "Orders"
  | "Holdings"
  | "Positions"
  | "Funds";

export interface IHeader {
  data: Tdata;
  setData: Dispatch<SetStateAction<Tdata>>;
}
function Header({ data, setData }: IHeader) {
  const rightSideItems: RightSideType[] = [
    "Dashboard",
    "Orders",
    "Holdings",
    "Positions",
    "Funds",
  ];

  const { symbolLiveState, socketSend } = useContext(SymbolLiveContext);

  useEffect(() => {
    const msg = {
      method: "SUBSCRIBE",
      params: ["btcusdt@ticker", "ethusdt@ticker"],
      id: 1,
    };

    socketSend(JSON.stringify(msg));
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
                setData((prev) => {
                  return {
                    ...prev,
                    rightSideData: {
                      type: "chart",
                      symbol: "BTCUSDT",
                      TimeFrame: "5",
                    },
                  };
                });
              }}
            >
              bitcoin
            </div>
            <div>
              {parseFloat(
                symbolLiveState.BTCUSDT ? symbolLiveState.BTCUSDT.c : "00.0",
              ).toFixed(2)}
            </div>
          </div>
          <div className="flex cursor-pointer gap-1">
            <div
              onClick={() => {
                setData((prev) => {
                  return {
                    ...prev,
                    rightSideData: {
                      type: "chart",
                      symbol: "ETHUSDT",
                      TimeFrame: "5",
                    },
                  };
                });
              }}
            >
              etherium
            </div>
            <div>
              {parseFloat(
                symbolLiveState.ETHUSDT ? symbolLiveState.ETHUSDT.c : "00.0",
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
                    (data.rightSideData.type === x ? "text-[#ff5722]" : "")
                  }
                  onClick={() => {
                    const newData = { ...data, rightSideData: { type: x } };
                    setData(newData);
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
              <div className="cursor-pointer text-center">#gtdc546</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
