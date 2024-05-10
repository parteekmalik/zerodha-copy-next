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
    id: string | number;
    data: {
      [key in (typeof headings)[number]]:
        | string
        | number
        | (() => string | number);
    };
  }[];
  options?: {
    selectedAction?: (orderid: string | number) => void;
    colorIndex?: (typeof headings)[number][];
  };
}) {
  const modifiedDataList = useMemo(() => {
    if (dataList.length) {
      return dataList.map((item) => {
        const data: {
          id: string | number;
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

  return (
    <table className={stylesList.table}>
      <thead className={stylesList.head}>
        <tr>
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
          {options?.selectedAction && <th>close</th>}
        </tr>
      </thead>
      <tbody className={stylesList.body}>
        {modifiedDataList?.map((items, i) => {
          return (
            <tr
              key={JSON.stringify(items) + i}
              className={"hover:bg-[#f9f9f9]"}
            >
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
              {options?.selectedAction && (
                <td className={stylesList.padding}>
                  <button
                    key={"checkbox" + items.id}
                    onClick={() => {
                      if (options?.selectedAction) {
                        console.log("cancelled | closed Trade ->", items.id);
                        options.selectedAction(items.id);
                      }
                    }}
                  >
                    x
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
      <tfoot></tfoot>
    </table>
  );
}
