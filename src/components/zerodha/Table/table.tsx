import * as React from "react";
import { getColor } from "~/app/utils";

// Correct type definition for GridColDef using keyof
export type GridColDef<T> = {
  headerName: string;
  field: keyof T;
  width: number;
};
export type Row = {
  id: string;
  name: string;
  quantity: number;
  avgPrice: number;
  totalPrice: number;
  LTP: string | undefined;
  "P&L": string;
  change: string;
};

export interface DataGridStyles {
  table?: { className?: string };
  head?: {
    className?: string;
    row?: string;
    cell?: string;
  };
  body?: {
    className?: string;
    row?: string;
    cell?: string;
  };
  footer?: {
    className?: string;
    button?: string;
  };
  checkbox?: string;
}

// Define the props for the DataGrid component
export interface DataGridProps<T> {
  rows: T[];
  styles?: DataGridStyles;
  columns: GridColDef<T>[];
  fotter: {
    "P&L": number;
    LTP: string;
    skip: number;
  };
  coloredCols?: (keyof T)[];
  selected?: (selectedIds: (string | number)[]) => void; // Update the type of selected to accept an array of IDs
}

// Custom DataGrid component
const DataGrid = ({
  rows,
  columns,
  selected,
  fotter,
  coloredCols = [],
  styles, // Default to empty object if not provided
}: DataGridProps<Row>) => {
  const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string,
  ) => {
    const value = e.target.checked;
    if (id === "all") {
      if (value) setSelectedIds(rows.map((it) => it.id));
      else setSelectedIds([]);
    } else if (value) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  // Apply styles or fallback to default styles
  const headStyles = styles?.head;
  const bodyStyles = styles?.body;
  const footerStyles = styles?.footer;
  const tableStyles = styles?.table;
  const checkboxStyles = styles?.checkbox;

  return (
    <table className={tableStyles?.className}>
      <thead className={headStyles?.className}>
        <tr className={headStyles?.row}>
          {selected && (
            <th>
              <input
                className={checkboxStyles}
                onChange={(e) => onChange(e, "all")}
                type="checkbox"
                checked={selectedIds.length === rows.length}
              />
            </th>
          )}
          {columns.map((item, i) => (
            <th key={i} className={headStyles?.cell}>
              {item.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={bodyStyles?.className}>
        {rows.map((row) => (
          <tr key={JSON.stringify(row)} className={bodyStyles?.row}>
            {selected && (
              <td className={checkboxStyles}>
                <input
                  onChange={(e) => onChange(e, row.id)}
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                />
              </td>
            )}
            {columns.map((col, i) => (
              <td
                className={
                  bodyStyles?.cell +
                  ` ${
                    coloredCols.includes(col.field)
                      ? getColor(Number(row[col.field]))
                      : " "
                  }`
                }
                key={i}
              >
                {coloredCols.includes(col.field)
                  ? addPositiveSign(row[col.field])
                  : row[col.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {
        <tfoot className={footerStyles?.className}>
          <tr>
            <td colSpan={fotter.skip + Number(selected !== undefined)}>
              {selectedIds.length && selected ? (
                <button
                  className={footerStyles?.button}
                  onClick={() => {
                    selected(selectedIds);
                  }}
                >
                  submit
                </button>
              ) : null}
            </td>
            <td className={bodyStyles?.cell}>{fotter.LTP}</td>
            <td
              className={
                bodyStyles?.cell + ` ${getColor(Number(fotter["P&L"]))}`
              }
            >
              {addPositiveSign(fotter["P&L"])}
            </td>
          </tr>
        </tfoot>
      }
    </table>
  );
};

export default DataGrid;

const addPositiveSign = (s: string | number | undefined) => {
  if (typeof s === "string") s = Number(s);
  if (!s) s = 0;
  if (s > 0) s = "+" + s;
  return String(s);
};
