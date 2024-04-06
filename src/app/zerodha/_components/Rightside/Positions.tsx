import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
  TcalculateTradesSummaryFIFO,
  calculateTradesSummaryFIFO,
} from "../../utils";
import { TOrder, stylesList } from "./Order";
import Table from "./Table/table";
const headings = [
  "Product",
  "Instrument",
  "Quantity",
  "AVG",
  "LTP",
  "P&L",
  "change",
];
const position_stylesList = {
  padding: " p-[10px_12px] ",
  table: " m-2 w-full ",
  head: " border-b-2 text-[.75rem]  text-[#9b9b9b] ",
  body: " text-center text-[14px] text-[#444444] ",
  row: ["  ", "  ", "", "  ", "  ", "", " border-r ", ""],
};

function Positions() {
  const orders = api.orders.getOrders24hr.useQuery().data;
  // const [orderMap, setOrderMap] = useState<{ [key: string]: TOrder[] }>({});
  const [dataList, setdataList] = useState<
    {
      id: string;
      data: (string | number)[];
    }[]
  >([]);
  useEffect(() => {
    console.log(orders);
    if (typeof orders === "object") {
      const temporderMap: Record<string, TOrder[]> = {};
      orders
        .filter((item) => item.status === "completed")
        .map((item) => {
          temporderMap[item.name]
            ? temporderMap[item.name]?.push(item)
            : (temporderMap[item.name] = [item]);
        });
      console.log(temporderMap);
      setdataList(
        Object.keys(temporderMap).map((key) => {
          const answer = calculations(temporderMap, key);
          return {
            id: "",
            data: [
              answer.Product,
              answer.Instrument,
              answer.Quantity,
              answer.AVG,
              answer.LTP,
              answer["P&L"],
              answer.change,
            ],
          };
        }),
      );
      // setOrderMap(temporderMap);
    }
  }, [orders]);
  if (typeof orders === "string") return <>{orders}</>;

  return (
    <div className="w-full bg-white">
      <div className="flex w-full p-2">
        <span className="grow text-[1.125rem] text-[#444444]">
          Open orders ({dataList?.length})
        </span>
      </div>
      <div className="flex w-full items-center justify-center">
        <Table
          stylesList={position_stylesList}
          options={{ colorIndex: [2,5,6] }}
          headings={headings}
          dataList={dataList}
        />
      </div>
      {/* <div style={{ wordWrap: "break-word" }}>{JSON.stringify(orders)}</div> */}
    </div>
  );
}
type Tanswer = {
  Product: string;
  Instrument: string;
  Quantity: number;
  AVG: number;
  LTP: string;
  "P&L": number;
  change: number;
};
function calculations(orderMap: Record<string, TOrder[]>, key: string) {
  const orders = orderMap[key];

  const answer: Tanswer = {
    Product: "SPOT",
    Instrument: key,
    Quantity: 0,
    AVG: 0,
    LTP: "LTP",
    "P&L": 1,
    change: -1,
  };
  if (orders) {
    const { avgPrice, profitOrLoss, netQuantity } = calculateTradesSummaryFIFO(
      orders.map((item) => {
        return {
          type: item.type,
          quantity: item.quantity,
          price: item.price,
        };
      }) as TcalculateTradesSummaryFIFO[],
      0,
    );
    answer.AVG = Number(avgPrice);
    answer["P&L"] = 1;
    answer.Quantity = netQuantity;
  }
  return answer;
}

export default Positions;
