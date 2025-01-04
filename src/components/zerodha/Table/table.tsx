import * as React from "react";
import { getColor, modifyNumber } from "~/app/v1/utils";
import { type DataGridProps, type RowType, TableDefaultstyles } from "./defaultStylexAndTypes";

// Custom DataGrid component
const DataGrid = <T extends RowType>({ rows, columns, selected, footer, coloredCols = [], styles = TableDefaultstyles }: DataGridProps<T>) => {
  const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, id: number | string) => {
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
  const headStyles = styles.head;
  const bodyStyles = styles.body;
  const footerStyles = styles.footer;
  const tableStyles = styles.table;
  const checkboxStyles = styles.checkbox;

  return (
    <table className={tableStyles?.className}>
      <thead className={headStyles?.className}>
        <tr className={headStyles?.row}>
          {selected && (
            <th>
              <input className={checkboxStyles} onChange={(e) => onChange(e, "all")} type="checkbox" checked={selectedIds.length === rows.length} />
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
          <tr key={row.id} className={bodyStyles?.row}>
            {selected && (
              <td className={checkboxStyles}>
                <input onChange={(e) => onChange(e, row.id)} type="checkbox" checked={selectedIds.includes(row.id)} />
              </td>
            )}
            {columns.map((col, i) => {
              // Declare variables correctly inside map
              const coloredColsItem = coloredCols.find((it) => it.name === col.field);
              const [cellContent, cellAdditionalStyles] = coloredColsItem
                ? coloredColsItem.fn(row, col.field, bodyStyles?.cell ?? "")
                : [String(row[col.field]), bodyStyles?.cell];

              return (
                <td key={i} className={cellAdditionalStyles}>
                  {cellContent}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      <tfoot className={footerStyles?.className}>
        <tr>
          <td colSpan={(footer?.skip ?? 1) + Number(selected !== undefined)}>
            {selectedIds.length && selected ? (
              <button
                className={footerStyles?.button}
                onClick={() => {
                  const items = selectedIds.map((id) => rows.find((i) => i.id === id)!);
                  selected.handleFn(items);
                  setSelectedIds([]);
                }}
              >
                {selected.text}
              </button>
            ) : null}
          </td>
          {footer && (
            <>
              <td className={bodyStyles?.cell}>{footer.LTP}</td>
              <td className={bodyStyles?.cell + ` ${getColor(Number(footer["P&L"]))}`}>{modifyNumber(footer["P&L"])}</td>
            </>
          )}
        </tr>
      </tfoot>
    </table>
  );
};

export default DataGrid;
