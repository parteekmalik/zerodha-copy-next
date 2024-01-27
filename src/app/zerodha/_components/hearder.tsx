import { Dispatch, SetStateAction } from "react";
import { Tdata } from "../page";
import { shadowBox } from "./tcss";

type RightSideType =
  | "Dashboard"
  | "Orders"
  | "Holdings"
  | "Positions"
  | "Bids"
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
    "Bids",
    "Funds",
  ];

  return (
    <header className={" justify-cente flex w-full bg-white" + shadowBox}>
      <div className="flex w-[1080px] max-w-[1080px]  gap-20  p-4">
        <div className="flex gap-5">
          <div>bitcoin</div>
          <div>etherium</div>
        </div>
        <div className="flex gap-4">
          <img
            className="h-[20px] w-auto"
            src="https://kite.zerodha.com/static/images/kite-logo.svg"
            alt=""
          />
          {rightSideItems.map((x: RightSideType) => (
            <div
              className="cursor-pointer border"
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
        <div className="flex gap-4">
          <div>notification</div>
          <div> client id </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
