import React, { useState } from "react";
import { shadowBox } from "../page";

function WatchList({ data: list }: { data: string[][] }) {
  const [watchListNo, setWatchListNo] = useState(0);
  return (
    <div className={"flex w-[430px] flex-col bg-white" + shadowBox}>
      <div className="flex min-w-[0px] p-3 justify-center border-b">
        <div></div>
        <input
          type="text"
          placeholder="Search eg: infy bse, nifty fut, nifty weekly, gold mcx"
        />
        <div></div>
      </div>
      <div className="flex flex-col">
        {list[watchListNo]?.map((name, i) => {
          return <div className="flex p-2 border-b ">{name}</div>;
        })}
      </div>
      <div className="grow"></div>
      <div className="flex gap-2 p-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((_, i) => {
          return (
            <div
              className=" grow border-2 px-3 py-2"
              onClick={() => {
                setWatchListNo(i);
              }}
            >
              {i}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WatchList;
