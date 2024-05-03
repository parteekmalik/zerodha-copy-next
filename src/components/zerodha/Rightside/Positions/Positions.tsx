import { useMemo } from "react";
import { useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { RootState } from "../../_redux/store";
import Table from "../Table/table";

const headings = ["Instrument", "Quantity", "AVG", "LTP", "P&L", "change"];
const position_stylesList = {
  padding: " p-[10px_12px] ",
  table: " m-2 w-full ",
  head: " border-b-2 text-[.75rem]  text-[#9b9b9b] ",
  body: " text-center text-[14px] text-[#444444] ",
  row: { LTP: " border-r " },
};
const options = { colorIndex: ["P&L", "change", "Quantity"] };

function Positions() {
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );
  const ordersQuery = api.getAccountInfo.getAssets.useQuery(TradingAccountId);
  const Livestream = useSelector((state: RootState) => state.Livestream);

  const dataList = useMemo(() => {
    if (typeof ordersQuery.data !== "object") return ordersQuery.data;
    else {
      const res = ordersQuery.data
        .filter((i) => i.name !== "USDT" && i.AvgPrice !== 0)
        .map((value) => {
          const Quantity = value.freeAmount + value.lockedAmount;
          const LTP = Livestream[value.name + "USDT"]?.curPrice ?? 0;
          const PnL = LTP === 0 ? 0 : (LTP - value.AvgPrice) * Quantity;
          const change = LTP === 0 ? 0 : (LTP / value.AvgPrice) * 100 - 100;

          return {
            id: value.id,
            data: {
              Instrument: value.name,
              Quantity,
              AVG: value.AvgPrice,
              LTP,
              "P&L": PnL.toFixed(2),
              change: change.toFixed(2) + "%",
            },
          };
        });
      return res;
    }
  }, [ordersQuery.data, Livestream]);

  if (Array.isArray(dataList)) {
    return (
      <div className="flex h-full w-full flex-col bg-white">
        <div className="w-full ">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Open orders ({dataList.length})
            </span>
          </div>
          <div className="flex w-full items-center justify-center">
            <Table
              stylesList={position_stylesList}
              options={options}
              headings={headings}
              dataList={dataList}
            />
          </div>
          {/* <div style={{ wordWrap: "break-word" }}>
          {JSON.stringify(dataList.open)}
        </div> */}
        </div>
        {/* <div className="w-full ">
        <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
        Closed orders ({dataList.close.length})
        </span>
        </div>
        <div className="flex w-full items-center justify-center">
        <Table
        stylesList={position_stylesList}
        options={options}
        headings={closeheadings}
        dataList={dataList.close}
        />
        </div>
        
      </div> */}
        <div className="grow"></div>
      </div>
    );
  } else return <>{JSON.stringify(ordersQuery.data)}</>;
}

export default Positions;
