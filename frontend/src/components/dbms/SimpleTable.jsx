import React from "react";

export default function SimpleTable({ title, rows, highlightRows = [], rowKeyField }) {
  if (!rows || rows.length === 0) {
    return (
      <section className="card">
        <h3>{title}</h3>
        <p style={{ color: "#9ca3af" }}>No data available.</p>
      </section>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>{title}</h3>

      <div style={{ overflowX: "auto" }}>
        <table className="dbms-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col.toUpperCase()}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => {
              const key = row[rowKeyField] ?? i;
              const isHighlighted = highlightRows.includes(key);

              return (
                <tr key={i} className={isHighlighted ? "highlight-row" : ""}>
                  {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}