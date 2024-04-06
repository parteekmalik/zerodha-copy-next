import { useEffect, useState } from "react";
import { getColor } from "../../WatchList/drag_drop_wishlist/Item";

export default function Table({
  headings,
  stylesList,
  dataList,
  options,
}: {
  headings: string[];
  stylesList: {
    row: string[];
    table: string;
    head: string;
    body: string;
    padding: string;
  };
  dataList: { id: string; data: (string | number)[] }[];
  options: {
    selectedAction?: (orderids: string[]) => void;
    colorIndex?: { quantity: number; list: number[] };
  };
}) {
  const [selected, setSelected] = useState<boolean[]>([]);
  const [selectedCount, setselectedCount] = useState(0);
  useEffect(() => {
    console.log("selected table", selected);
    setselectedCount(
      selected.reduce((prev, curr, currIndex) => {
        if (curr === true) prev++;
        return prev;
      }, 0),
    );
  }, [selected]);
  useEffect(() => {
    console.log("selectedCount", selectedCount);
  }, [selectedCount]);
  return (
    <table className={stylesList.table}>
      <thead className={stylesList.head}>
        <tr>
          {options.selectedAction && <th>checkbox</th>}
          {headings.map((item, i) => {
            return (
              <th
                key={JSON.stringify(item) + i}
                className={
                  stylesList.padding + stylesList.row[i] + " hover:bg-[#f9f9f9]"
                }
              >
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={stylesList.body}>
        {dataList?.map((items, i) => {
          return (
            <tr
              key={JSON.stringify(items) + i}
              className={"hover:bg-[#f9f9f9]"}
            >
              {options.selectedAction && (
                <td className={stylesList.padding}>
                  <input
                    key={"checkbox" + items.id}
                    type="checkbox"
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setSelected((prev) => {
                        prev[i] = e.target.checked;
                        return [...prev];
                      });
                    }}
                  />
                </td>
              )}
              {items.data.map((item, i) => {
                return (
                  <td
                    // using random for key
                    key={JSON.stringify(item) + i}
                    className={
                      stylesList.padding +
                      stylesList.row[i] +
                      (options.colorIndex &&
                      items.data[options.colorIndex.quantity] !== 0 &&
                      options.colorIndex?.list.includes(i)
                        ? getColor(item)
                        : " ")
                    }
                  >
                    {item}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        {selectedCount > 0 ? (
          <tr className={" hover:bg-[#f9f9f9]"}>
            <td colSpan={3} className={stylesList.padding + " text-[.75rem]"}>
              <button
                className="rounded bg-[#4184f3] p-[7px_12px] text-white"
                onClick={() => {
                  const list = selected.reduce((prev: string[], cur, i) => {
                    if (cur) {
                      const temp = dataList[i]?.id;
                      if (temp) prev.push(temp);
                    }
                    return prev;
                  }, []);
                  if (options.selectedAction) options.selectedAction(list);
                }}
              >
                Cancel {selectedCount} order
              </button>
            </td>
            <td colSpan={6}></td>
          </tr>
        ) : null}
      </tfoot>
    </table>
  );
}
