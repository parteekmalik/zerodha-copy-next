import { Edit } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import BackndWSContext from "~/components/zerodha/_contexts/backendWS/backendWS";
import { RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/react";

const headings = [
  "Instrument",
  "Quantity",
  "Price",
  "SL",
  "TP",
  "LTP",
  "P&L",
  "change",
];
const position_stylesList = {
  padding: " p-[10px_12px] ",
  table: " m-2 w-full ",
  head: " border-b-2 text-[.75rem]  text-[#9b9b9b] ",
  body: " text-center text-[14px] text-[#444444] ",
  row: { LTP: " border-r " },
};

function Pending({
  updateTP_SL,
}: {
  updateTP_SL: (
    orderid: string | number,
    value: number,
    type: "tp" | "sl",
  ) => void;
}) {
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );
  const ordersQuery = api.Trades.getPendingTrades.useQuery(TradingAccountId);
  const Livestream = useSelector((state: RootState) => state.Livestream);

  const dataList = useMemo(() => {
    if (typeof ordersQuery.data !== "object") return ordersQuery.data;
    else {
      const res = ordersQuery.data.map((value) => {
        const LTP = Livestream[value.name]?.curPrice ?? 0;
        const PnL = 0;
        const change = 0;

        return {
          id: value.id,
          data: {
            Instrument: value.name,
            Quantity: value.quantity,
            Price: value.openPrice,
            LTP,
            SL: value.sl,
            TP: value.tp,
            "P&L": PnL.toFixed(2),
            change: change.toFixed(2) + "%",
          } as Record<string, string | number>,
        };
      });
      return res;
    }
  }, [ordersQuery.data, Livestream]);

  const APIutils = api.useUtils();
  const { WSsendOrder } = useContext(BackndWSContext);

  const cancelOrderApi = api.Trades.cancelTrade.useMutation({
    onSuccess(data, variables, context) {
      console.log(data, variables, context);
      WSsendOrder("order", data);
    },
    onSettled() {
      APIutils.Trades.getPendingTrades
        .invalidate()
        .catch((err) => console.log(err));
    },
  });
  const selectedAction = useCallback((orderid: string | number) => {
    cancelOrderApi.mutate({
      Taccounts: TradingAccountId,
      orderids: orderid,
    });
  }, []);
  if (Array.isArray(dataList)) {
    return (
      <div className="flex h-full w-full flex-col bg-white">
        <div className="w-full ">
          <div className="flex w-full p-2">
            <span className="grow text-[1.125rem] text-[#444444]">
              Pending Trades ({dataList.length})
            </span>
          </div>
          <div className="flex w-full items-center justify-center">
            <table className={position_stylesList.table}>
              <thead className={position_stylesList.head}>
                <tr>
                  {headings.map((value) => {
                    return <th key={"heading" + value}>{value}</th>;
                  })}
                  <th>close</th>
                </tr>
              </thead>
              <tbody className={position_stylesList.body}>
                {dataList.map((valueList, index) => {
                  return (
                    <tr className="hover:bg-[#f9f9f9]" key={valueList.id}>
                      {headings.map((key, index) => {
                        return (
                          <Cell
                            updateTP_SL={updateTP_SL}
                            key={valueList.id + key}
                            valueList={valueList}
                            Key={key}
                          />
                        );
                      })}
                      <td>
                        <button onClick={() => selectedAction(valueList.id)}>
                          x
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </div>
        <div className="grow"></div>
      </div>
    );
  } else return <>{JSON.stringify(ordersQuery.data)}</>;
}
export function Cell(
  props: {
    valueList: {
      id: number;
      data: Record<string, string | number>;
    };
    updateTP_SL: (
      orderid: string | number,
      value: number,
      type: "tp" | "sl",
    ) => void;
    Key: string;
  } & React.HTMLAttributes<HTMLTableCellElement>,
) {
  const { valueList, Key, updateTP_SL, ...rest } = props;
  const [isEdit, setisEdit] = useState(false);
  const [value, setvalue] = useState("");
  return !isEdit ? (
    <td {...rest}>
      {valueList.data[Key]}
      {Key === "TP" || Key === "SL" ? (
        <button onClick={() => setisEdit(true)}>
          <Edit className="h-[12px]"></Edit>
        </button>
      ) : null}
    </td>
  ) : (
    <td>
      <div className="flex justify-center">
        <input
          className="max-w-[50px] grow border border-black"
          type="number"
          value={value}
          onChange={(e) => setvalue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateTP_SL(
                valueList.id,
                Number(value),
                Key === "TP" ? "tp" : "sl",
              );
              setisEdit(false);
            }
          }}
        ></input>
        <button
          onClick={() => {
            updateTP_SL(
              valueList.id,
              Number(value),
              Key === "TP" ? "tp" : "sl",
            );
            setisEdit(false);
          }}
        >
          save
        </button>
      </div>
    </td>
  );
}
export default Pending;