import React from "react";

export default function SimpleTable({
  title,
  rows = [],
  highlightRows = [],
  rowKeyField = "id"
}) {
  const columns =
    rows.length > 0
      ? Object.keys(rows[0])
      : [];

  return (
    <div className="dbms-table-shell">
      <h3 className="dbms-table-title">{title}</h3>

      {rows.length === 0 ? (
        <div className="dbms-empty">No data yet. Run the simulation.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column.toUpperCase()}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const rowKey = row[rowKeyField] ?? index;
                const isHighlighted = highlightRows.includes(row[rowKeyField]);

                return (
                  <tr
                    key={rowKey}
                    className={isHighlighted ? "dbms-row-highlight" : ""}
                  >
                    {columns.map((column) => (
                      <td key={column}>{row[column]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}