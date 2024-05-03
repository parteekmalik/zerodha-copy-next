import { useEffect, useMemo, useState } from "react";
import { getColor } from "../../WatchList/drag_drop_wishlist/Item";

export default function Table({
  headings,
  stylesList,
  dataList,
  options,
}: {
  headings: string[];
  stylesList: {
    row: { [key in (typeof headings)[number]]: string };
    table: string;
    head: string;
    body: string;
    padding: string;
  };
  dataList: {
    id: string;
    data: {
      [key in (typeof headings)[number]]:
        | string
        | number
        | (() => string | number);
    };
  }[];
  options?: {
    selectedAction?: (orderids: string[]) => void;
    colorIndex?: (typeof headings)[number][];
  };
}) {
  const [selected, setSelected] = useState<boolean[]>([]);
  const [selectedCount, setselectedCount] = useState(0);
  const modifiedDataList = useMemo(() => {
    if (dataList.length) {
      return dataList.map((item) => {
        const data: {
          id: string;
          data: (string | number)[];
        } = {
          id: item.id,
          data: [],
        };
        headings.map((key) => {
          let value = item.data[key];
          if (value === undefined) value = key;
          if (typeof value === "function") data.data.push(value());
          else data.data.push(value);
        });
        return data;
      });
    }
  }, [dataList]);
  // useEffect(() => console.log("checking"), [dataList]);

  useEffect(() => {
    console.log("selected table", selected);
    setselectedCount(
      selected.reduce((prev, curr, currIndex) => {
        if (curr === true) prev++;
        return prev;
      }, 0),
    );
  }, [selected]);

  return (
    <table className={stylesList.table}>
      <thead className={stylesList.head}>
        <tr>
          {options?.selectedAction && <th>checkbox</th>}
          {headings.map((item, i) => {
            return (
              <th
                key={JSON.stringify(item) + i + "dfs"}
                className={
                  stylesList.padding +
                  stylesList.row[item] +
                  " hover:bg-[#f9f9f9]"
                }
              >
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={stylesList.body}>
        {modifiedDataList?.map((items, i) => {
          return (
            <tr
              key={JSON.stringify(items) + i}
              className={"hover:bg-[#f9f9f9]"}
            >
              {options?.selectedAction && (
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
              {items.data.map((value, i) => {
                return (
                  <td
                    // using random for key
                    key={JSON.stringify(value) + i + "Dsfsf"}
                    className={
                      stylesList.padding +
                      (stylesList.row[headings[i] ?? ""] ?? " ") +
                      (options?.colorIndex &&
                      options.colorIndex.includes(headings[i] ?? "")
                        ? getColor(value)
                        : " ")
                    }
                  >
                    {value}
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
                  if (options?.selectedAction) options.selectedAction(list);
                  setSelected([]);
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
