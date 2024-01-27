import { Dispatch, SetStateAction } from "react";
import { Tdata } from "../page";
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

  return (
    <header
      className={" flex w-full justify-center bg-white text-xs " + shadowBox}
    >
      <div className="flex min-h-[60px] w-full max-w-[1536px]">
        <div className="flex h-full min-w-[430px] items-center justify-center gap-5 border-r">
          <div>bitcoin</div>
          <div>etherium</div>
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
                  className="cursor-pointer text-center px-[15px]"
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
