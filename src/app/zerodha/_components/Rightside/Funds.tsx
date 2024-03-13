import React, { PropsWithChildren } from "react";
import { shadowBox } from "../tcss";

function Funds() {
  return (
    <div className="h-full w-full bg-white p-[30px_20px]">
      <div className="mb-3 flex justify-end gap-5">
        <span className=" flex items-center text-[.75rem] text-[#9b9b9b]">
          Instant, zerro-cost fund transfers with fake money
        </span>
        <div className="test-[.925rem] flex gap-1 text-white">
          <div
            className="rounded bg-[#4caf50] p-[8px_20px] hover:cursor-pointer "
            onClick={(e) => console.log("add funds button")}
          >
            Add funds
          </div>
          <div
            className="rounded bg-[#4184f3] p-[8px_20px] hover:cursor-pointer "
            onClick={(e) => console.log("widrawal button")}
          >
            Withdraw
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-[48%] ">
          <h3 className="mx-1 my-3 flex">
            <div className="grow text-[1.17em]">Equity</div>
            <div className="flex gap-2 text-[.625rem] text-[#4184f3]">
              <div>View Statement</div>
              <div>Help</div>
            </div>
          </h3>
          <ListBox Style={{ textColor: " text-[#444444] " }}>
            <MainBox
              data={[
                { name: "Avl bal", value: 40 },
                { name: "Avl bal", value: 40 },
                { name: "Avl bal", value: 40 },
              ]}
              isMain={true}
              Style={["  ", " text-[2em] "]}
            />
          </ListBox>
          <ListBox Style={{ textColor: " text-[#444444] " }}>
            <MainBox
              data={[
                { name: "Avl bal", value: 40 },
                { name: "Avl bal", value: 40 },
                { name: "Avl bal", value: 40 },
              ]}
              isMain={false}
            />
          </ListBox>
        </div>
      </div>
    </div>
  );
}
function MainBox(props: {
  data: Trow[];
  Style?: [string, string];
  isMain: boolean;
}) {
  const { data, Style = ["", ""], isMain } = props;
  return (
    <div className="border-b-1">
      {data.map((item, i) => {
        return (
          <div className="flex" key={i}>
            <div
              className={
                " flex grow items-center p-[10px_12px] opacity-[.7]  " +
                Style[0]
              }
            >
              {item.name}
            </div>
            <div
              className={
                " p-[10px_12px] " +
                Style[1] +
                (i === 0 && isMain ? " text-[#4184f3] " : "")
              }
            >
              {Number(item.value).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
type Trow = { name: string; value: number | string };
interface IListBox {
  Style: { textColor: string };
}
const ListBox: React.FunctionComponent<PropsWithChildren<IListBox>> = (
  props,
) => {
  const { children, Style } = props;
  return (
    <div
      className={
        "w-full border border-[#eeeeee] bg-white p-[20px] text-[.875rem] " +
        Style.textColor +
        " " +
        shadowBox
      }
    >
      {children}
    </div>
  );
};
export default Funds;
